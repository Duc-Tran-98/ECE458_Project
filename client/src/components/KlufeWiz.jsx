/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import $ from 'jquery';
import VerticalLinearStepper from './VerticalStepper';
import UserContext from './UserContext';
import { stepInfo } from '../utils/Klufe';
import Query from './UseQuery';
import {
  KlufeOff, KlufeStep,
} from '../queries/KlufeQueries';

// const DEBUG = process.env.NODE_ENV.includes('dev');

export default function KlufeWiz({
  initModelNumber, initVendor, initSerialNumber, initAssetTag, onFinish = null,
}) {
  KlufeWiz.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    initSerialNumber: PropTypes.string.isRequired,
    initAssetTag: PropTypes.number.isRequired,
    onFinish: PropTypes.func.isRequired,
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
    step4ok: false,
    step7ok: false,
    step9ok: false,
    step11ok: false,
    step13ok: false,
  });
  const [shouldRestart, setRestart] = React.useState(false);
  const [readings, setReadings] = React.useState({
    4: '', 7: '', 9: '', 11: '', 13: '',
  });

  const handleRestart = (bool = true) => {
    setRestart(false);
    if (bool) {
      setFormState({
        modelNumber: initModelNumber,
        vendor: initVendor,
        serialNumber: initSerialNumber,
        assetTag: initAssetTag,
        date: today,
        user: user.userName,
        comment: '',
        step4ok: false,
        step7ok: false,
        step9ok: false,
        step11ok: false,
        step13ok: false,
      });
    }
  };
  const handleFinish = () => {
    const {
      assetTag, date, comment, step4ok, step7ok, step9ok, step11ok, step13ok,
    } = formState;
    const klufeData = JSON.stringify({
      readings,
      step4ok,
      step7ok,
      step9ok,
      step11ok,
      step13ok,
    });
    Query({
      query: print(gql`
        mutation AddKlufeCalib (
            $assetTag: Int!,
            $date: String!,
            $user: String!,
            $comment: String,
            $klufeData: String!,
          ){
          addKlufeCalibration(
            assetTag: $assetTag,
            date: $date,
            user: $user,
            comment: $comment,
            klufeData: $klufeData,
          )
        }
      `),
      queryName: 'addKlufeCalibration',
      getVariables: () => ({
        assetTag,
        date,
        user: user.userName,
        comment,
        klufeData,
      }),
      handleResponse: (response) => {
        if (response.success) {
          onFinish();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      },
    });
    handleRestart();
  };
  const handleResponse = (response) => {
    console.log(response);
  };
  React.useEffect(() => () => { KlufeOff({ handleResponse }); }, []);
  const handleNext = (step) => {
    switch (step) {
      case 1:
      case 3:
      case 6:
      case 8:
      case 10:
      case 12:
        KlufeStep({ handleResponse, stepNum: step, stepStart: true });
        break;
      case 4:
      case 7:
      case 9:
      case 11:
      case 13:
        KlufeOff({ handleResponse });
        break;
      default:
    }
  };
  const handleBack = (step) => {
    switch (step) {
      case 2:
      case 4:
      case 7:
      case 9:
      case 11:
      case 13:
        KlufeOff({ handleResponse });
        break;
      default:
    }
  };
  const isInRange = (actual, lower, upper) => (actual >= lower) && (actual <= upper);
  const updateReadings = ({ e, step }) => { // update state
    readings[step] = e.target.valueAsNumber;
    switch (step) {
      case 4:
        setFormState({ ...formState, step4ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 7:
        setFormState({ ...formState, step7ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 9:
        setFormState({ ...formState, step9ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 11:
        setFormState({ ...formState, step11ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 13:
        setFormState({ ...formState, step13ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      default:
    }
  };
  const canAdvance = (step) => { // whether or not user can advance a step
    switch (step) {
      case 4:
        return formState.step4ok;
      case 7:
        return formState.step7ok;
      case 9:
        return formState.step9ok;
      case 11:
        return formState.step11ok;
      case 13:
        return formState.step13ok;
      default:
        return true;
    }
  };
  React.useEffect(() => {
    $(document).on('keypress', (e) => {
      // use e.which instead of e.code
      if (e.which === 13 && canAdvance) {
        const nextBtn = document.querySelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained btn MuiButton-containedPrimary"]');
        if (nextBtn) {
          nextBtn.click();
        }
      }
    });
  }, []);
  const handleKeyPress = ({ e, canAdvanceStep = false }) => {
    if (e.code === 'Enter' && canAdvanceStep) {
      const nextBtn = document.querySelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained btn MuiButton-containedPrimary"]');
      if (nextBtn) {
        nextBtn.click();
      }
    }
  };
  const getSteps = () => [ // outer steps for wizard
    'Calibration Info', // 0
    'Start Klufe K5700', // 1
    'Connect Model 87', // 2
    'Set Source to 3.5V', // 3
    'Record 3.5V Display', // 4
    'Change Model 87 Function', // 5
    'Set Source to 3.513V at 50 Hz', // 6
    'Record 3.513V at 50 Hz Display', // 7
    'Set Source to 100V at 20 kHz', // 8
    'Record 100V at 20 kHz Display', // 9
    'Set Source to 3.500V at 10 kHz', // 10
    'Record 3.500V at 10 kHz Display', // 11
    'Set Source to 35.00V at 10 kHz', // 12
    'Record 35.00V at 10 kHz Display', // 13
  ];

  const inputDisplay = (step) => (
    <Formik>
      {({
        setFieldTouched,
        touched,
      }) => (
        <>
          <div className="row">
            <Form.Group className="col">
              <Form.Label className="h6 my-auto">
                Displayed Value
              </Form.Label>
              <Form.Control
                name="userInput"
                type="number"
                min={0}
                className="w-50"
                value={readings[step]}
                autoFocus
                onChange={(e) => {
                  setFieldTouched('userInput', true);
                  updateReadings({ e, step });
                }}
                onKeyDown={(e) => handleKeyPress({ e, canAdvanceStep: canAdvance(step) })}
                isInvalid={touched.userInput && !isInRange(readings[step], stepInfo[step].lower, stepInfo[step].upper)}
              />
              <Form.Control.Feedback type="invalid">
                {stepInfo[step].message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col">
              <Form.Label className="h6 my-auto">
                Acceptable Range
              </Form.Label>
              <Form.Control
                type="text"
                className="w-50"
                disabled
                value={stepInfo[step].range}
              />
            </Form.Group>
            <div className="col" />
          </div>
        </>
      )}
    </Formik>
  );

  const getStepContent = (step) => { // generate step content for outer wizard
    switch (step) {
      case 0:
        return (
          <div>
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
                />
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
                />
              </Form.Group>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for VDC, 0V.
            </div>
          </div>
        );
      case 2:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              On the Model 87, select the
              <img src="/symbols/V.svg" alt="test" width="12 pt" style={{ marginLeft: 5 }} />
              <img src="/symbols/dc.svg" alt="test" width="12 pt" style={{ marginRight: 5 }} />
              function. Then, connect the source to the Model 87
              <img src="/symbols/V.svg" alt="test" width="12 pt" style={{ marginLeft: 5 }} />
              <img src="/symbols/omega.svg" alt="test" width="12 pt" />
              <img src="/symbols/diode.svg" alt="test" width="15 pt" style={{ marginRight: 5 }} />
              and COM inputs.
            </div>
          </div>
        );
      case 3:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for 3.500V dc output.
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="d-flex flex-row my-1">
              <div className="d-flex flex-row mb-2">
                Please input the value displayed on the Model 87.
              </div>
            </div>
            {inputDisplay(step)}
          </div>
        );
      case 5:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              Now set the Model 87 to the
              <img src="/symbols/V.svg" alt="test" width="12 pt" style={{ marginLeft: 5 }} />
              <img src="/symbols/tilde.svg" alt="test" width="12 pt" style={{ marginRight: 5 }} />
              function.
            </div>
          </div>
        );
      case 6:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 3.513V at 50 Hz.
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <div className="d-flex flex-row my-1">
              <div className="d-flex flex-row mb-2">
                Please input the value displayed on the Model 87.
              </div>
            </div>
            {inputDisplay(step)}
          </div>
        );
      case 8:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 100V at 20 kHz.
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <div className="d-flex flex-row my-1">
              <div className="d-flex flex-row mb-2">
                Please input the value displayed on the Model 87.
              </div>
            </div>
            {inputDisplay(step)}
          </div>
        );
      case 10:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 3.500V at 10 kHz.
            </div>
          </div>
        );
      case 11:
        return (
          <div>
            <div className="d-flex flex-row my-1">
              <div className="d-flex flex-row mb-2">
                Please input the value displayed on the Model 87.
              </div>
            </div>
            {inputDisplay(step)}
          </div>
        );
      case 12:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 35.00V at 10 kHz.
            </div>
          </div>
        );
      case 13:
        return (
          <div>
            <div className="d-flex flex-row my-1">
              <div className="d-flex flex-row mb-2">
                Please input the value displayed on the Model 87.
              </div>
            </div>
            {inputDisplay(step)}
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
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
