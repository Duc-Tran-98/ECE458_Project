/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import VerticalLinearStepper from './VerticalStepper';
import UserContext from './UserContext';
import AsyncSuggest from './AsyncSuggest';

export default function LoadBankWiz() {
  const user = React.useContext(UserContext);
  const today = new Date().toISOString().split('T')[0];
  const [formState, setFormState] = React.useState({
    modelNumber: '458',
    vendor: 'Fluke',
    serialNumber: 'ABC123',
    assetTag: 100000,
    date: today,
    user: user.userName,
    voltMeter: null,
    shuntMeter: null,
    visualCheckOk: false,
    connectedToDC: false,
    voltageCutoffOk: false,
    alarmOk: false,
    recordedDataOk: false,
    printerOk: false,
  });
  const [currentReadings, setCurrentReadings] = React.useState([
    {
      cr: 0, ca: 0, id: 0, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 1, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 2, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 3, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 4, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 5, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 6, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 7, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 8, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 9, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 10, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 11, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 12, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 13, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 14, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 15, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 16, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 17, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 18, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 19, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 20, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 21, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 22, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 23, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 24, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 25, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 26, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 27, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 28, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 29, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 30, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 31, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 32, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 33, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0, ca: 0, id: 34, crError: 0, crOk: false, caError: 0, caOk: false,
    },
    {
      cr: 0,
      ca: 0,
      id: 35,
      crError: 0,
      crOk: false,
      caError: 0,
      caOk: false,
    },
  ]);
  const [voltageReading, setVoltageReading] = React.useState({
    va: 0, vr: 0, vaOk: false, vrOk: false, vaError: 0, vrError: 0,
  });
  const calcVRError = () => {
    if (voltageReading.va > 0) {
      return 100 * (Math.abs(voltageReading.va - voltageReading.vr) / voltageReading.va);
    }
    return 100;
  };
  const calcVAError = () => 100 * (Math.abs(voltageReading.va - 48) / 48);
  const updateVoltageReadings = ({ e = null, finished = false }) => {
    const {
      va, vr, vaOk, vrOk, vaError, vrError,
    } = voltageReading;
    const newReadings = {
      va, vr, vaOk, vrOk, vaError, vrError,
    };
    if (!finished) {
      if (e.target.name === 'va') {
        newReadings.va = e.target.valueAsNumber;
      } else {
        newReadings.vr = e.target.valueAsNumber;
      }
    } else {
      newReadings.vaError = calcVAError();
      newReadings.vaOk = newReadings.vaError < 10;
      newReadings.vrError = calcVRError();
      newReadings.vrOk = newReadings.vrError < 1;
    }
    setVoltageReading(newReadings);
  };
  const canAdvance = (step) => { // whether or not user can advance a step
    switch (step) {
      case 1:
        return formState.voltMeter !== null && formState.shuntMeter !== null;
      case 2:
        return formState.visualCheckOk;
      case 3:
        return formState.connectedToDC;
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
  const idealCurrents = [
    0,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1020,
    1040,
    1060,
    1080,
    1100,
    1101,
    1102,
    1103,
    1104,
    1105,
    1106,
    1107,
    1108,
    1109,
    1110,
    1111,
    1112,
    1113,
    1114,
    1115,
    1116,
    1117,
    1118,
    1119,
    1120,
  ];
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
  const calcCRError = (step) => {
    const entry = currentReadings.filter((element) => element.id === step)[0];
    if (step === 0) {
      return entry.cr === 0 ? 0 : 100;
    }
    if (entry.ca > 0) {
      return 100 * (Math.abs(entry.ca - entry.cr) / entry.ca);
    }
    return 100;
  };
  const calcCAError = (step) => {
    const entry = currentReadings.filter((element) => element.id === step)[0];
    if (step === 0) {
      return entry.ca === 0 ? 0 : 100;
    }
    return (
      100 * (Math.abs(entry.ca - idealCurrents[step]) / idealCurrents[step])
    );
  };
  const updateCurrentReadings = ({ e = null, step, finished = false }) => {
    const newReadings = currentReadings.filter((element) => element.id !== step);
    const entry = currentReadings.filter((element) => element.id === step);
    if (!finished) {
      if (e.target.name === 'ca') {
        entry[0].ca = e.target.valueAsNumber;
      } else {
        entry[0].cr = e.target.valueAsNumber;
      }
    } else {
      entry[0].caError = calcCAError(step);
      entry[0].caOk = entry[0].caError < 3;
      entry[0].crError = calcCRError(step);
      entry[0].crOk = entry[0].crError < 3;
    }
    setCurrentReadings(newReadings.concat(entry));
  };
  const getLoadStepContent = (step) => { // what to display for each load step
    switch (step) {
      case 36:
        return (
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
                  onChange={(e) => updateVoltageReadings({ e })}
                  value={voltageReading.vr}
                />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">
                  VA: Voltage actual [V] (from voltmeter)
                </Form.Label>
                <Form.Control
                  name="va"
                  type="number"
                  className="w-50"
                  onChange={(e) => updateVoltageReadings({ e })}
                  value={voltageReading.va}
                />
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
        );
      default:
        return (
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
                  value={currentReadings.filter((element) => element.id === step)[0].cr}
                  onChange={(e) => updateCurrentReadings({ e, step })}
                />
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
                  onChange={(e) => updateCurrentReadings({ e, step })}
                />
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
          <div className="col my-1">
            <Form.Group className="row my-2">
              <Form.Label className="h6 my-auto">Model:</Form.Label>
              <Form.Control
                name="model"
                type="text"
                disabled
                className="w-25 ms-2"
                value={`${formState.vendor}-${formState.modelNumber}`}
              />
            </Form.Group>
            <Form.Group className="row my-2">
              <Form.Label className="h6 my-auto">Serial:</Form.Label>
              <Form.Control
                name="serialNumber"
                type="text"
                value={formState.serialNumber}
                disabled
                className="w-25 ms-2"
              />
            </Form.Group>
            <Form.Group className="row my-2">
              <Form.Label className="h6 my-auto">Asset Tag:</Form.Label>
              <Form.Control
                name="assetTag"
                type="number"
                value={formState.assetTag}
                disabled
                className="w-25 ms-2"
              />
            </Form.Group>
            <Form.Group className="row my-2">
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
                className="w-25 ms-2"
              />
            </Form.Group>
            <Form.Group className="row my-2">
              <Form.Label className="h6 my-auto">Engineer: </Form.Label>
              <Form.Control
                name="user"
                type="text"
                value={user.userName}
                disabled
                className="w-25 ms-2"
              />
            </Form.Group>
          </div>
        );
      case 1:
        return (
          <div className="d-flex flex-column my-1">
            <Form.Group className="row my-2">
              <Form.Label className="h6 my-auto">
                Voltmeter to be used:
              </Form.Label>
              <div className="w-25">
                <AsyncSuggest
                  query={print(gql`
                    query GetModelNumbers {
                      getAllModels {
                        modelNumber
                      }
                    }
                  `)} // TODO: Make sure selection also shows asset tag and passes it to backend
                  queryName="getAllModels"
                  // eslint-disable-next-line no-unused-vars
                  onInputChange={(_e, v) => setFormState({ ...formState, voltMeter: v.modelNumber })}
                  label="Select a voltmeter"
                  getOptionLabel={(option) => `${option.modelNumber}`}
                  getOptionSelected={(option, value) => option.modelNumber === value.modelNumber}
                  isInvalid={false}
                  value={formState.voltMeter ? { modelNumber: formState.voltMeter } : null}
                />
              </div>
            </Form.Group>
            <Form.Group className="row my-2">
              <Form.Label className="h6 my-auto">
                Current shunt meter to be used:
              </Form.Label>
              <div className="w-25">
                <AsyncSuggest
                  query={print(gql`
                    query GetModelNumbers {
                      getAllModels {
                        modelNumber
                      }
                    }
                  `)} // TODO: Make sure selection also shows asset tag and passes it to backend
                  queryName="getAllModels"
                  // eslint-disable-next-line no-unused-vars
                  onInputChange={(_e, v) => setFormState({ ...formState, shuntMeter: v.modelNumber })}
                  label="Select a shunt meter"
                  getOptionLabel={(option) => `${option.modelNumber}`}
                  getOptionSelected={(option, value) => option.modelNumber === value.modelNumber}
                  isInvalid={false}
                  value={formState.shuntMeter ? { modelNumber: formState.shuntMeter } : null}
                />
              </div>
            </Form.Group>
            <div className="d-flex flex-row mx-3 mb-2">
              Ensure voltmeter and current shunt meter are calibrated
            </div>
          </div>
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
              20 steps of 1A). Then record current displayed on load bank and
              current measured from shunt for each load step. Continue until all
              load steps are on. Lastly, record voltage displayed on load bank
              and voltage measured via DMM.
            </div>
            <VerticalLinearStepper
              onFinish={() => undefined}
              getSteps={getLoadSteps}
              getStepContent={getLoadStepContent}
              finishMsg="You're finished with the load steps"
              onNext={(prevStep) => (prevStep !== 36 ? updateCurrentReadings({ step: prevStep, finished: true }) : updateVoltageReadings({ finished: true }))}
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
      onFinish={() => setFormState({
        modelNumber: '458',
        vendor: 'Fluke',
        serialNumber: 'ABC123',
        assetTag: 100000,
        date: today,
        user: user.userName,
        voltMeter: null,
        shuntMeter: null,
        visualCheckOk: false,
        connectedToDC: false,
        voltageCutoffOk: false,
        alarmOk: false,
        recordedDataOk: false,
        printerOk: false,
      })}
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
