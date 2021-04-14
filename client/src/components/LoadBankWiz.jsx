/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import VerticalLinearStepper from './VerticalStepper';
import UserContext from './UserContext';
import AsyncSuggest from './AsyncSuggest';
import { defaultCurrents, idealCurrents, devCurrents } from '../utils/LoadBank';
import Query from './UseQuery';

const DEBUG = process.env.NODE_ENV.includes('dev');

export default function LoadBankWiz({
  initModelNumber, initVendor, initSerialNumber, initAssetTag, onFinish = null,
}) {
  LoadBankWiz.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    initSerialNumber: PropTypes.string.isRequired,
    initAssetTag: PropTypes.number.isRequired,
    // eslint-disable-next-line react/require-default-props
    onFinish: PropTypes.func,
  };
  const user = React.useContext(UserContext);
  const today = new Date().toISOString().split('T')[0];
  const [formState, setFormState] = React.useState({
    modelNumber: initModelNumber,
    vendor: initVendor,
    serialNumber: initSerialNumber,
    assetTag: initAssetTag,
    date: today,
    user: user.userName,
    comment: '',
    voltMeter: null,
    voltMeterOk: true,
    shuntMeter: null,
    shuntMeterOk: true,
    visualCheckOk: false,
    connectedToDC: false,
    voltageCutoffOk: false,
    alarmOk: false,
    recordedDataOk: false,
    printerOk: false,
  });
  const [canProgress, setCanProgress] = React.useState(false);
  const [shouldRestart, setRestart] = React.useState(false);
  let copyDevCurrents = JSON.parse(JSON.stringify(devCurrents));
  let copyDefaultCurrents = JSON.parse(JSON.stringify(defaultCurrents));
  const [currentReadings, setCurrentReadings] = React.useState(DEBUG ? copyDevCurrents : copyDefaultCurrents);
  const [voltageReading, setVoltageReading] = React.useState({
    va: 0, vr: 0, vaOk: false, vrOk: false, vaError: 0, vrError: 0,
  });
  const maxCalibrationComment = 2000;
  const calcVRError = () => { // calculate vr error given va and vr
    if (voltageReading.va > 0) {
      return 100 * (Math.abs(voltageReading.va - voltageReading.vr) / voltageReading.va);
    }
    return 100;
  };
  const isVRError = () => calcVRError() >= 1;
  const calcVAError = () => 100 * (Math.abs(voltageReading.va - 48) / 48); // calculate va error
  const ivVAError = () => calcVAError() >= 10;
  const updateVoltageReadings = ({ e }) => { // update state
    const {
      va, vr, vaOk, vrOk, vaError, vrError,
    } = voltageReading;
    const newReadings = {
      va, vr, vaOk, vrOk, vaError, vrError,
    };
    if (e.target.name === 'va') {
      newReadings.va = e.target.valueAsNumber;
    } else {
      newReadings.vr = e.target.valueAsNumber;
    }
    newReadings.vaError = 100 * (Math.abs(newReadings.va - 48) / 48);
    newReadings.vaOk = newReadings.vaError < 10;
    newReadings.vrError = newReadings.va > 0 ? 100 * (Math.abs(newReadings.va - newReadings.vr) / newReadings.va) : 100;
    newReadings.vrOk = newReadings.vrError < 1;
    setVoltageReading(newReadings);
    setRestart(!newReadings.vaOk || !newReadings.vrOk);
  };
  const handleRestart = (bool = true) => {
    setRestart(false);
    if (bool) {
      setFormState({
        modelNumber: initModelNumber,
        vendor: initVendor,
        serialNumber: initSerialNumber,
        assetTag: initAssetTag,
        date: today,
        comment: '',
        user: user.userName,
        voltMeter: null,
        voltMeterOk: true,
        shuntMeter: null,
        shuntMeterOk: true,
        visualCheckOk: false,
        connectedToDC: false,
        voltageCutoffOk: false,
        alarmOk: false,
        recordedDataOk: false,
        printerOk: false,
      });
    }
    setVoltageReading(
      {
        va: 0, vr: 0, vaOk: false, vrOk: false, vaError: 0, vrError: 0,
      },
    );
    copyDevCurrents = JSON.parse(JSON.stringify(devCurrents));
    copyDefaultCurrents = JSON.parse(JSON.stringify(defaultCurrents));
    setCurrentReadings(DEBUG ? copyDevCurrents : copyDefaultCurrents);
  };
  const handleFinish = () => {
    const {
      assetTag, date, comment, voltMeter, shuntMeter, visualCheckOk, connectedToDC, voltageCutoffOk, alarmOk, recordedDataOk, printerOk,
    } = formState;
    const loadBankData = JSON.stringify({
      currentReadings,
      voltageReading,
      voltMeter,
      shuntMeter,
      visualCheckOk,
      connectedToDC,
      voltageCutoffOk,
      alarmOk,
      recordedDataOk,
      printerOk,
    });
    Query({
      query: gql`
        mutation AddLoadBankCalib (
            $assetTag: Int!,
            $date: String!,
            $user: String!,
            $comment: String,
            $loadBankData: String!,
          ){
          addLoadBankCalibration(
            assetTag: $assetTag,
            date: $date,
            user: $user,
            comment: $comment,
            loadBankData: $loadBankData,
          )
        }
      `,
      queryName: 'addLoadBankCalibration',
      getVariables: () => ({
        assetTag,
        date,
        user: user.userName,
        comment,
        loadBankData,
      }),
      handleResponse: (response) => {
        if (response.success) {
          toast.success(response.message);
          if (onFinish) {
            onFinish();
          }
        } else {
          toast.error(response.message);
        }
      },
    });
    handleRestart();
  };
  const validateCalibrationDate = ({ date, calibrationFrequency }) => {
    if (calibrationFrequency === 0) return true;
    if (date) {
      const todayToo = new Date();
      const calibDate = new Date(date);
      // today - calibDate <= calibration Frequency
      return (Math.round((todayToo.getTime() - calibDate.getTime()) / (1000 * 3600 * 24)) <= calibrationFrequency);
    }
    return false;
  };
  const validateDate = (date) => {
    const input = new Date(Date.parse(date));
    const maxDay = new Date(Date.now());
    input.setHours(0, 0, 0, 0);
    maxDay.setHours(0, 0, 0, 0);
    // console.log(input <= maxDay, input, maxDay, date);
    return input >= maxDay;
  };
  const canAdvance = (step) => { // whether or not user can advance a step
    switch (step) {
      case 1:
        return (
          DEBUG || (formState.voltMeterOk && formState.shuntMeterOk && formState.voltMeter !== null && formState.shuntMeter !== null)
        );
      case 2:
        return formState.visualCheckOk;
      case 3:
        return formState.connectedToDC;
      case 4:
        return canProgress;
      case 5:
        return formState.voltageCutoffOk;
      case 6:
        return formState.alarmOk;
      case 7:
        return formState.recordedDataOk;
      case 8:
        return formState.printerOk;
      default:
        return true;
    }
  };
  const getLoadSteps = () => [ // steps for load calibration
    'No load', // 0
    '1 x 100A', // 1
    '2 x 100A', // 2
    '3 x 100A', // 3
    '4 x 100A', // 4
    '5 x 100A', // 5
    '6 x 100A', // 6
    '7 x 100A', // 7
    '8 x 100A', // 8
    '9 x 100A', // 9
    '10 x 100A', // 10
    '10 x 100A + 1 x 20A', // 11
    '10 x 100A + 2 x 20A', // 12
    '10 x 100A + 3 x 20A', // 13
    '10 x 100A + 4 x 20A', // 14
    '10 x 100A + 5 x 20A', // 15
    '10 x 100A + 5 x 20A + 1 x 1A', // 16
    '10 x 100A + 5 x 20A + 2 x 1A', // 17
    '10 x 100A + 5 x 20A + 3 x 1A', // 18
    '10 x 100A + 5 x 20A + 4 x 1A', // 19
    '10 x 100A + 5 x 20A + 5 x 1A', // 20
    '10 x 100A + 5 x 20A + 6 x 1A', // 21
    '10 x 100A + 5 x 20A + 7 x 1A', // 22
    '10 x 100A + 5 x 20A + 8 x 1A', // 23
    '10 x 100A + 5 x 20A + 9 x 1A', // 24
    '10 x 100A + 5 x 20A + 10 x 1A', // 25
    '10 x 100A + 5 x 20A + 11 x 1A', // 26
    '10 x 100A + 5 x 20A + 12 x 1A', // 27
    '10 x 100A + 5 x 20A + 13 x 1A', // 28
    '10 x 100A + 5 x 20A + 14 x 1A', // 29
    '10 x 100A + 5 x 20A + 15 x 1A', // 30
    '10 x 100A + 5 x 20A + 16 x 1A', // 31
    '10 x 100A + 5 x 20A + 17 x 1A', // 32
    '10 x 100A + 5 x 20A + 18 x 1A', // 33
    '10 x 100A + 5 x 20A + 19 x 1A', // 34
    '10 x 100A + 5 x 20A + 20 x 1A', // 35
    'Record final voltage', // 36
  ];
  const calcCRError = (step) => { // calc cr error
    const entry = currentReadings.filter((element) => element.id === step)[0];
    if (step === 0) {
      return entry.cr === 0 ? 0 : 100;
    }
    if (entry.ca > 0) {
      return 100 * (Math.abs(entry.ca - entry.cr) / entry.ca);
    }
    return 100;
  };
  const isCRError = (step) => {
    const caError = calcCRError(step);
    return caError >= 3;
  };
  const calcCAError = (step) => { // calc ca error
    const entry = currentReadings.filter((element) => element.id === step)[0];
    if (step === 0) {
      return entry.ca === 0 ? 0 : 100;
    }
    return (
      100 * (Math.abs(entry.ca - idealCurrents[step]) / idealCurrents[step])
    );
  };
  const isCAError = (step) => {
    const caError = calcCAError(step);
    return caError >= 5;
  };
  const updateCurrentReadings = ({ e, step }) => { // update current measurements
    const newReadings = currentReadings.filter((element) => element.id !== step);
    const entry = currentReadings.filter((element) => element.id === step);
    if (e.target.name === 'ca') {
      entry[0].ca = e.target.valueAsNumber;
    } else {
      entry[0].cr = e.target.valueAsNumber;
    }
    entry[0].caError = calcCAError(step);
    entry[0].caOk = entry[0].caError < 5;
    entry[0].crError = calcCRError(step);
    entry[0].crOk = entry[0].crError < 3;
    setCurrentReadings(newReadings.concat(entry));
    setRestart(!entry[0].caOk || !entry[0].crOk);
  };
  const canAdvanceLoadStep = (step) => { // when user can go to next step in load steps
    if (step >= 0 && step < 36) { // 36 is the last load step
      const entry = currentReadings.filter((element) => element.id === step)[0];
      return entry && entry.caOk && entry.crOk;
    }
    return voltageReading.vaOk && voltageReading.vrOk;
  };
  const handleKeyPress = ({ e, canAdvanceStep = false }) => {
    if (e.code === 'Enter' && canAdvanceStep) {
      const nextBtn = document.querySelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained btn MuiButton-containedPrimary"]');
      if (nextBtn) {
        nextBtn.click();
      }
    }
  };
  const getLoadStepContent = (step) => { // what to display for each load step
    switch (step) {
      case 36:
        return (
          <Formik>
            {({
              setFieldTouched,
              touched,
            }) => (
              <div className="d-flex flex-column">
                <div className="d-flex flex-row mb-2">
                  Record voltage displayed on load bank and voltage measured via DMM
                  when all load banks are on.
                </div>
                <div className="row mx-2">
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">
                      VR: Voltage reported [V] (from display)
                    </Form.Label>
                    <Form.Control
                      name="vr"
                      type="number"
                      className="w-50"
                      autoFocus
                      onFocus={(e) => {
                        if (!touched.vr) {
                          e.target.value = ''; // clear on focus
                        }
                      }}
                      min={0}
                      value={voltageReading.vr}
                      onKeyDown={(e) => handleKeyPress({ e, canAdvanceStep: canAdvanceLoadStep(36) })}
                      onChange={(e) => {
                        setFieldTouched('vr', true);
                        updateVoltageReadings({ e });
                      }}
                      isInvalid={touched.vr && isVRError(step)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Adjust ppm setting to fix, then check again
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">
                      VA: Voltage actual [V] (from voltmeter)
                    </Form.Label>
                    <Form.Control
                      name="va"
                      type="number"
                      min={0}
                      className="w-50"
                      value={voltageReading.va}
                      onKeyDown={(e) => handleKeyPress({ e, canAdvanceStep: canAdvanceLoadStep(36) })}
                      onChange={(e) => {
                        setFieldTouched('va', true);
                        updateVoltageReadings({ e });
                      }}
                      isInvalid={touched.vr && ivVAError()}
                    />
                    <Form.Control.Feedback type="invalid">
                      Too much sag. Check DC source and redo calibration
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">Test voltage [V]</Form.Label>
                    <Form.Control
                      type="number"
                      className="w-50"
                      disabled
                      value={48}
                    />
                  </Form.Group>
                </div>
                <div className="row mx-2">
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">VR error [%]</Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={calcVRError().toFixed(2)}
                    />
                    <Form.Label className="h6 my-auto">
                      VR ok? (under 1%)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={calcVRError() < 1 ? 'Ok' : 'FAIL'}
                    />
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">VA error [%]</Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={calcVAError().toFixed(2)}
                    />
                    <Form.Label className="h6 my-auto">
                      VA ok? (under 10%)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={calcVAError() < 10 ? 'Ok' : 'FAIL'}
                    />
                  </Form.Group>
                  <div className="col" />
                </div>
              </div>
            )}
          </Formik>
        );
      default:
        return (
          <Formik>
            {({
              setFieldTouched,
              touched,
            }) => (
              <>
                <div className="row">
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">
                      CR: Current reported [A] (from display)
                    </Form.Label>
                    <Form.Control
                      name="cr"
                      type="number"
                      min={0}
                      className="w-50"
                      autoFocus
                      onFocus={(e) => {
                        if (!touched.cr) {
                          e.target.value = ''; // clear on focus!
                        }
                      }}
                      value={currentReadings.filter((element) => element.id === step)[0].cr}
                      onChange={(e) => {
                        setFieldTouched('cr', true);
                        updateCurrentReadings({ e, step });
                      }}
                      onKeyDown={(e) => handleKeyPress({ e, canAdvanceStep: canAdvanceLoadStep(step) })}
                      isInvalid={touched.cr && isCRError(step)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Adjust ppm setting to fix, then restart
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">
                      CA: Current actual [A] (from shunt meter)
                    </Form.Label>
                    <Form.Control
                      name="ca"
                      type="number"
                      min={0}
                      className="w-50"
                      value={currentReadings.filter((element) => element.id === step)[0].ca}
                      onChange={(e) => {
                        setFieldTouched('ca', true);
                        updateCurrentReadings({ e, step });
                      }}
                      onKeyDown={(e) => handleKeyPress({ e, canAdvanceStep: canAdvanceLoadStep(step) })}
                      isInvalid={touched.ca && isCAError(step)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Check and repair/replace load cell, then restart
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">
                      Ideal current [A]
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={idealCurrents[step]}
                    />
                  </Form.Group>
                </div>
                <div className="row">
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">CR error [%]</Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={step === 0 ? 'N/A' : calcCRError(step).toFixed(2)}
                    />
                    <Form.Label className="h6 my-auto">
                      CR ok? (under 3%)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={calcCRError(step) < 3 ? 'Ok' : 'FAIL'}
                    />
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="h6 my-auto">CA error [%]</Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={step === 0 ? 'N/A' : calcCAError(step).toFixed(2)}
                    />
                    <Form.Label className="h6 my-auto">
                      CA ok? (under 5%)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="w-50"
                      disabled
                      value={calcCAError(step) < 3 ? 'Ok' : 'FAIL'}
                    />
                  </Form.Group>
                  <div className="col" />
                </div>
              </>
            )}
          </Formik>
        );
    }
  };
  const getSteps = () => [ // outer steps for wizard
    'Calibration Info', // 0
    'Verify measurement tools are calibrated', // 1
    'Visual Check', // 2
    'Connect to DC source', // 3
    'Turn on load steps', // 4 5 6 7?
    'Verify low voltage cutoff', // 8
    'Verify alarm sounds', // 9
    'Verify data is on computer', // 10
    'Verify printer works', // 11
  ];
  const getStepContent = (step) => { // generate step content for outer wizard
    switch (step) {
      case 0:
        return (
          <>
            <div className="row my-1">
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">Model:</Form.Label>
                <Form.Control
                  name="model"
                  type="text"
                  disabled
                  className=""
                  value={`${formState.vendor}-${formState.modelNumber}`}
                />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">Serial:</Form.Label>
                <Form.Control
                  name="serialNumber"
                  type="text"
                  value={formState.serialNumber}
                  disabled
                  className=""
                />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">Asset Tag:</Form.Label>
                <Form.Control
                  name="assetTag"
                  type="number"
                  value={formState.assetTag}
                  disabled
                  className=""
                />
              </Form.Group>
            </div>
            <div className="row my-2">
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">
                  Date of calibration:
                </Form.Label>
                <Form.Control
                  name="date"
                  type="date"
                  max={today}
                  onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                  required
                  value={formState.date}
                  className=""
                  isInvalid={validateDate(formState.date)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid date. Dates cannot be in the future.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">Engineer: </Form.Label>
                <Form.Control
                  name="user"
                  type="text"
                  value={user.userName}
                  disabled
                  className=""
                />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6">Calibration Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="comment"
                  value={formState.comment}
                  onChange={(e) => setFormState({ ...formState, comment: e.target.value })}
                  isInvalid={formState.comment.length > maxCalibrationComment}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a shorter calibration comment.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="d-flex flex-row my-1">
              <Form.Group className="col mx-2">
                <Form.Label className="h6 my-auto">
                  Voltmeter to be used: (Vendor-Model number-Asset Tag)
                </Form.Label>
                <div className="">
                  <AsyncSuggest
                    query={gql`
                      query Instruments($modelCategories: [String]) {
                        getInstrumentsWithFilter(modelCategories: $modelCategories) {
                          instruments {
                            vendor
                            modelNumber
                            assetTag
                            calibrationFrequency
                            recentCalibration {
                              date
                            }
                          }
                        }
                      }
                    `}
                    queryName="getInstrumentsWithFilter"
                    getVariables={() => ({ modelCategories: ['voltmeter'] })}
                    // eslint-disable-next-line no-unused-vars
                    onInputChange={(_e, v) => {
                      // if (!DEBUG) {
                      const voltMeterOk = validateCalibrationDate({
                        date: v?.recentCalibration[0]?.date,
                        calibrationFrequency: v.calibrationFrequency,
                      });
                      setFormState({
                        ...formState,
                        voltMeter: v,
                        voltMeterOk,
                      });
                      // }
                    }}
                    label="Select a voltmeter"
                    getOptionLabel={(option) => `${option.vendor}-${option.modelNumber}-${option.assetTag}`}
                    getOptionSelected={(option, value) => (option.assetTag === value.assetTag && option.vendor)
                        === value.vendor && option.modelNumber === value.modelNumber}
                    isInvalid={!formState.voltMeterOk}
                    invalidMsg="That voltmeter is out of calibration!"
                    value={formState.voltMeter}
                  />
                </div>
              </Form.Group>
              <Form.Group className="col mx-2">
                <Form.Label className="h6 my-auto">
                  Current shunt meter to be used: (Vendor-Model number-Asset
                  Tag)
                </Form.Label>
                <div className="">
                  <AsyncSuggest
                    query={gql`
                    query Instruments($modelCategories: [String]) {
                      getInstrumentsWithFilter(modelCategories: $modelCategories) {
                        instruments {
                          vendor
                          modelNumber
                          assetTag
                          calibrationFrequency
                          recentCalibration {
                            date
                          }
                        }
                      }
                    }
                  `}
                    queryName="getInstrumentsWithFilter"
                    getVariables={() => ({ modelCategories: ['current_shunt_meter'] })}
                    // eslint-disable-next-line no-unused-vars
                    onInputChange={(_e, v) => {
                      // if (!DEBUG) {
                      const shuntMeterOk = validateCalibrationDate({
                        date: v?.recentCalibration[0]?.date,
                        calibrationFrequency: v.calibrationFrequency,
                      });
                      setFormState({
                        ...formState,
                        shuntMeter: v,
                        shuntMeterOk,
                      });
                      // }
                    }}
                    label="Select a shunt meter"
                    getOptionLabel={(option) => `${option.vendor}-${option.modelNumber}-${option.assetTag}`}
                    getOptionSelected={(option, value) => (option.assetTag === value.assetTag && option.vendor)
                        === value.vendor && option.modelNumber === value.modelNumber}
                    isInvalid={!formState.shuntMeterOk}
                    invalidMsg="That current shunt meter is out of calibration!"
                    value={formState.shuntMeter}
                  />
                </div>
              </Form.Group>
            </div>
            <div className="row">
              <div className="col mb-2 mx-2">
                Ensure voltmeter and current shunt meter are calibrated
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="form-check form-switch">
                <label className="form-check-label mx-2 h6">
                  Visual check ok?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formState.visualCheckOk}
                  onChange={(e) => setFormState({ ...formState, visualCheckOk: e.target.checked })}
                />
              </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Perform visual inspection of load bank resistors before starting
              test
            </div>
          </div>
        );
      case 3:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="form-check form-switch">
                <label className="form-check-label mx-2 h6">
                  Connected to DC source?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formState.connectedToDC}
                  onChange={(e) => setFormState({ ...formState, connectedToDC: e.target.checked })}
                />
              </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Make sure the instruments are connected to a DC source
            </div>
          </div>
        );
      case 4:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row mx-3">
              Turn on load steps one at time (10 steps of 100A, 5 steps of 20A,
              20 steps of 1A). Then record the current displayed on load bank and the
              current measured from shunt for each load step. Continue until all
              load steps are on. Lastly, record voltage displayed on load bank
              and voltage measured via DMM.
            </div>
            <VerticalLinearStepper
              onFinish={() => setCanProgress(true)}
              getSteps={getLoadSteps}
              getStepContent={getLoadStepContent}
              canAdvance={canAdvanceLoadStep}
              forceReset={shouldRestart}
              handleRestart={() => handleRestart(false)}
              finishMsg="You're finished with the load steps"
            />
          </div>
        );
      case 5:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="form-check form-switch">
                <label className="form-check-label mx-2 h6">
                  Low voltage cutoff?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formState.voltageCutoffOk}
                  onChange={(e) => setFormState({ ...formState, voltageCutoffOk: e.target.checked })}
                />
              </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Lower dc source voltage below 43V to check if load bank
              automatically shuts down on low voltage
            </div>
          </div>
        );
      case 6:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="form-check form-switch">
                <label className="form-check-label mx-2 h6">
                  Cell voltage disconnect alarm?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formState.alarmOk}
                  onChange={(e) => setFormState({ ...formState, alarmOk: e.target.checked })}
                />
              </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Lift cell voltage lead and confirm buzzer sounds
            </div>
          </div>
        );
      case 7:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="form-check form-switch">
                <label className="form-check-label mx-2 h6">
                  Recorded data ok?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formState.recordedDataOk}
                  onChange={(e) => setFormState({ ...formState, recordedDataOk: e.target.checked })}
                />
              </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Verify load bank's recorded data on computer
            </div>
          </div>
        );
      case 8:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="form-check form-switch">
                <label
                  className="form-check-label mx-2 h6"
                >
                  Printer works?
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formState.printerOk}
                  onChange={(e) => setFormState({ ...formState, printerOk: e.target.checked })}
                />
              </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Make sure that the printer is plugged in and working
            </div>
          </div>
        );

      default:
        return 'Unknown step';
    }
  };
  return (
    <VerticalLinearStepper
      getStepContent={getStepContent}
      getSteps={getSteps}
      canAdvance={canAdvance}
      showResetBtn
      onFinish={handleFinish}
    />
  );
}

/*
1 - Load Step Verification
- Ensure voltmeter and current shunt meter are calibrated
- Perform visual inspection of load bank resistors before starting test
- Connect to dc source
- Turn on load steps one at time (10 steps of 100A, 5 steps of 20A, 20 steps of 1A)
- Record current displayed on load bank and current measured from shunt for each load step
If actual current is >5% off, check and repair/replace load cell, then restart
If measured current is >3% off, adjust ppm setting to fix, then restart
- Continue until all load steps are on
- Record voltage displayed on load bank and voltage measured via DMM
If actual voltage is below 43.2V, that’s too much sag. Check DC source and redo calibration
If measured voltage is >1% off, adjust ppm setting to fix, then check again
2 - Functional Checks
- Lower dc source voltage to check if load bank automatically shuts down on low voltage
- Lift cell voltage lead to check if audible buzzer activates
- Verify load bank's recorded data on computer
- Verify printer works

*/
