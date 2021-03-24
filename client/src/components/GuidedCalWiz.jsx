/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import VerticalLinearStepper from './VerticalStepper';
import UserContext from './UserContext';
import AsyncSuggest from './AsyncSuggest';
import { stepInfo } from '../utils/GuidedCal';
import Query from './UseQuery';
import {
  KlufeOn, KlufeOff, KlufeStep, KlufeStatus,
} from '../queries/KlufeQueries';

const DEBUG = process.env.NODE_ENV.includes('dev');

export default function GuidedCalWiz({
  initModelNumber, initVendor, initSerialNumber, initAssetTag,
}) {
  GuidedCalWiz.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    initSerialNumber: PropTypes.string.isRequired,
    initAssetTag: PropTypes.number.isRequired,
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
    step5ok: false,
    step8ok: false,
    step10ok: false,
    step12ok: false,
    step14ok: false,
  });
  const [canProgress, setCanProgress] = React.useState(false);
  const [shouldRestart, setRestart] = React.useState(false);
  const [readings, setReadings] = React.useState({
    5: NaN, 8: NaN, 10: NaN, 12: NaN, 14: NaN,
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
        step5ok: false,
        step8ok: false,
        step10ok: false,
        step12ok: false,
        step14ok: false,
      });
    }
  };
  const handleFinish = () => {
    const {
      assetTag, date, comment, step5ok, step8ok, step10ok, step12ok, step14ok,
    } = formState;
    const guidedCalData = JSON.stringify({
      readings,
      step5ok,
      step8ok,
      step10ok,
      step12ok,
      step14ok,
    });
    Query({ // TODO: fix this query for guided cal not load bank
      query: print(gql`
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
      `),
      queryName: 'addLoadBankCalibration',
      getVariables: () => ({
        assetTag,
        date,
        user: user.userName,
        comment,
        guidedCalData,
      }),
      handleResponse: (response) => {
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      },
    });
    handleRestart();
  };
  const handleNext = (step) => {
    switch (step) {
      case 1:
        KlufeOn();
        break;
      case 4:
      case 7:
      case 9:
      case 11:
      case 13:
        KlufeStep({ stepNum: step, stepStart: true });
        break;
      case 5:
      case 8:
      case 10:
      case 12:
      case 14:
        KlufeOff();
        break;
      default:
    }
  };
  const handleBack = (step) => {
    switch (step) {
      case 5:
      case 8:
      case 10:
      case 12:
      case 14:
        KlufeOff();
        break;
      default:
    }
  };
  const isInRange = (actual, lower, upper) => (actual >= lower) && (actual <= upper);
  const updateReadings = ({ e, step }) => { // update state
    readings[step] = e.target.valueAsNumber;
    switch (step) {
      case 5:
        setFormState({ ...formState, step5ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 8:
        setFormState({ ...formState, step8ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 10:
        setFormState({ ...formState, step10ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 12:
        setFormState({ ...formState, step12ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      case 14:
        setFormState({ ...formState, step14ok: isInRange(e.target.valueAsNumber, stepInfo[step].lower, stepInfo[step].upper) });
        break;
      default:
    }
  };
  const canAdvance = (step) => { // whether or not user can advance a step
    switch (step) {
      case 5:
        return formState.step5ok;
      case 8:
        return formState.step8ok;
      case 10:
        return formState.step10ok;
      case 12:
        return formState.step12ok;
      case 14:
        return formState.step14ok;
      default:
        return true;
    }
  };
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
    'Step 1', // 1
    'Step 2', // 2
    'Step 3', // 3
    'Step 4', // 4
    'Step 5', // 5
    'Step 6', // 6
    'Step 7', // 7
    'Step 8', // 8
    'Step 9', // 9
    'Step 10', // 10
    'Step 11', // 11
    'Step 12', // 12
    'Step 13', // 13
    'Step 14', // 14
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
          </>
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
              <img src="symbols/V.svg" alt="test" width="12 pt" style={{ marginLeft: 5 }} />
              <img src="symbols/dc.svg" alt="test" width="12 pt" style={{ marginRight: 5 }} />
              function.
            </div>
          </div>
        );
      case 3:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              Connect the source to the Model 87
              <img src="symbols/V.svg" alt="test" width="12 pt" style={{ marginLeft: 5 }} />
              <img src="symbols/omega.svg" alt="test" width="12 pt" />
              <img src="symbols/diode.svg" alt="test" width="15 pt" style={{ marginRight: 5 }} />
              and COM inputs.
            </div>
          </div>
        );
      case 4:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for 3.500V dc output.
            </div>
          </div>
        );
      case 5:
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
      case 6:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              Now set the Model 87 to the
              <img src="symbols/V.svg" alt="test" width="12 pt" style={{ marginLeft: 5 }} />
              <img src="symbols/tilde.svg" alt="test" width="12 pt" style={{ marginRight: 5 }} />
              function.
            </div>
          </div>
        );
      case 7:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 3.513V at 50 Hz.
            </div>
          </div>
        );
      case 8:
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
      case 9:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 100V at 20 kHz.
            </div>
          </div>
        );
      case 10:
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
      case 11:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 3.500V at 10 kHz.
            </div>
          </div>
        );
      case 12:
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
      case 13:
        return (
          <div className="d-flex flex-row my-1">
            <div className="d-flex flex-row mb-2">
              The calibrator source will be set for an output of 35.00V at 10 kHz.
            </div>
          </div>
        );
      case 14:
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
    />
  );
}
