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
  const canAdvance = (step) => {
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
  const getLoadSteps = () => [
    'No load',
    '1 x 100A',
    '2 x 100A',
    '3 x 100A',
    '4 x 100A',
    '5 x 100A',
    '6 x 100A',
    '7 x 100A',
    '8 x 100A',
    '9 x 100A',
    '10 x 100A',
    '10 x 100A + 1 x 20A',
    '10 x 100A + 2 x 20A',
    '10 x 100A + 3 x 20A',
    '10 x 100A + 4 x 20A',
    '10 x 100A + 5 x 20A',
    '10 x 100A + 5 x 20A + 1 x 1A',
    '10 x 100A + 5 x 20A + 2 x 1A',
    '10 x 100A + 5 x 20A + 3 x 1A',
    '10 x 100A + 5 x 20A + 4 x 1A',
    '10 x 100A + 5 x 20A + 5 x 1A',
    '10 x 100A + 5 x 20A + 6 x 1A',
    '10 x 100A + 5 x 20A + 7 x 1A',
    '10 x 100A + 5 x 20A + 8 x 1A',
    '10 x 100A + 5 x 20A + 9 x 1A',
    '10 x 100A + 5 x 20A + 10 x 1A',
    '10 x 100A + 5 x 20A + 11 x 1A',
    '10 x 100A + 5 x 20A + 12 x 1A',
    '10 x 100A + 5 x 20A + 13 x 1A',
    '10 x 100A + 5 x 20A + 14 x 1A',
    '10 x 100A + 5 x 20A + 15 x 1A',
    '10 x 100A + 5 x 20A + 16 x 1A',
    '10 x 100A + 5 x 20A + 17 x 1A',
    '10 x 100A + 5 x 20A + 18 x 1A',
    '10 x 100A + 5 x 20A + 19 x 1A',
    '10 x 100A + 5 x 20A + 20 x 1A',
  ];
  const getLoadStepContent = (step) => {
    switch (step) {
      default:
        return (
          <>
            <div className="row">
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">
                  CR: Current reported [A] (from display)
                </Form.Label>
                <Form.Control name="cr" type="text" className="w-50" />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">
                  CA: Current actual [A] (from shunt meter)
                </Form.Label>
                <Form.Control name="ca" type="text" className="w-50" />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">
                  Ideal current [A]
                </Form.Label>
                <Form.Control type="text" className="w-50" disabled value="0" />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">CR error [%]</Form.Label>
                <Form.Control type="text" className="w-50" disabled value="0" />
                <Form.Label className="h6 my-auto">
                  CR ok? (under 3%)
                </Form.Label>
                <Form.Control
                  type="text"
                  className="w-50"
                  disabled
                  value="Yes"
                />
              </Form.Group>
              <Form.Group className="col">
                <Form.Label className="h6 my-auto">CA error [%]</Form.Label>
                <Form.Control type="text" className="w-50" disabled value="0" />
                <Form.Label className="h6 my-auto">
                  CA ok? (under 5%)
                </Form.Label>
                <Form.Control type="text" className="w-50" disabled value="0" />
              </Form.Group>
              <div className="col" />
            </div>
          </>
        );
    }
  };
  const getSteps = () => [
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
  const getStepContent = (step) => {
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
                <input type="checkbox" className="form-check-input" onChange={(e) => setFormState({ ...formState, visualCheckOk: e.target.checked })} />
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
                <input type="checkbox" className="form-check-input" onChange={(e) => setFormState({ ...formState, connectedToDC: e.target.checked })} />
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
                <input type="checkbox" className="form-check-input" onChange={(e) => setFormState({ ...formState, voltageCutoffOk: e.target.checked })} />
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
                <input type="checkbox" className="form-check-input" onChange={(e) => setFormState({ ...formState, alarmOk: e.target.checked })} />
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
                <input type="checkbox" className="form-check-input" onChange={(e) => setFormState({ ...formState, recordedDataOk: e.target.checked })} />
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
