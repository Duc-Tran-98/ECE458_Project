/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import VerticalLinearStepper from './VerticalStepper';
// import AsyncSuggest from './AsyncSuggest';

export default function LoadBankWiz() {
  const getSteps = () => [
    'Calibration Info', // 0
    'Ensure measurement tools are calibrated', // 1
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
        return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`;
      case 1:
        return (
          <div className="d-flex flex-column my-1">
            <div className="d-flex flex-row">
              <div className="h6">Voltmeter to be used:</div>
            </div>
            <div className="d-flex flex-row">
              <div className="h6">Current shunt meter to be used:</div>
            </div>
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
                <input type="checkbox" className="form-check-input" />
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
                <input type="checkbox" className="form-check-input" />
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
            <div className="d-flex flex-row">
              <div className="h6">Connected to DC source? </div>
            </div>
            <div className="d-flex flex-row mx-3 mb-2">
              Turn on load steps one at time (10 steps of 100A, 5 steps of 20A,
              20 steps of 1A) Record current displayed on load bank and current
              measured from shunt for each load step Continue until all load
              steps are on Record voltage displayed on load bank and voltage
              measured via DMM
            </div>
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
                <input type="checkbox" className="form-check-input" />
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
                <input type="checkbox" className="form-check-input" />
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
                <input type="checkbox" className="form-check-input" />
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
      onFinish={() => console.log('finished')}
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
