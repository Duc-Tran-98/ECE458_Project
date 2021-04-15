import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { idealCurrents } from '../utils/LoadBank';

export default function TableLoadBank({ loadBankData }) {
  TableLoadBank.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    loadBankData: PropTypes.object.isRequired,
  };
  const calcCRError = (step) => {
    // calc cr error
    const entry = loadBankData.currentReadings.filter((element) => element.id === step)[0];
    if (step === 0) {
      return entry.cr === 0 ? 0 : 100;
    }
    if (entry.ca > 0) {
      return 100 * (Math.abs(entry.ca - entry.cr) / entry.ca);
    }
    return 100;
  };
  const calcCAError = (step) => {
    // calc ca error
    const entry = loadBankData.currentReadings.filter((element) => element.id === step)[0];
    if (step === 0) {
      return entry.ca === 0 ? 0 : 100;
    }
    return (
      100 * (Math.abs(entry.ca - idealCurrents[step]) / idealCurrents[step])
    );
  };
  const loadStepsTable = (
    <>
      {loadBankData.currentReadings.map((ele) => (
        <div className="my-2">
          <div className="row">
            <Form.Group className="col">
              <Form.Label className="h6 my-auto">
                Current Reported [A] (from display)
              </Form.Label>
              <Form.Control
                name="cr"
                type="number"
                min={0}
                className="w-50"
                disabled
                value={
                  loadBankData.currentReadings.filter(
                    (element) => element.id === ele.id,
                  )[0].cr
                }
              />
              <Form.Control.Feedback type="invalid">
                Adjust ppm setting to fix, then restart
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col">
              <Form.Label className="h6 my-auto">
                Current Actual [A] (from shunt meter)
              </Form.Label>
              <Form.Control
                name="ca"
                type="number"
                min={0}
                className="w-50"
                disabled
                value={
                  loadBankData.currentReadings.filter(
                    (element) => element.id === ele.id,
                  )[0].ca
                }
              />
              <Form.Control.Feedback type="invalid">
                Check and repair/replace load cell, then restart
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col">
              <Form.Label className="h6 my-auto">Ideal current [A]</Form.Label>
              <Form.Control
                type="text"
                className="w-50"
                disabled
                value={idealCurrents[ele.id]}
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
                value={ele.id === 0 ? 'N/A' : calcCRError(ele.id).toFixed(2)}
              />
              <Form.Label className="h6 my-auto">CR ok? (under 3%)</Form.Label>
              <Form.Control
                type="text"
                className="w-50"
                disabled
                value={calcCRError(ele.id) < 3 ? 'Ok' : 'FAIL'}
              />
            </Form.Group>
            <Form.Group className="col">
              <Form.Label className="h6 my-auto">CA error [%]</Form.Label>
              <Form.Control
                type="text"
                className="w-50"
                disabled
                value={ele.id === 0 ? 'N/A' : calcCAError(ele.id).toFixed(2)}
              />
              <Form.Label className="h6 my-auto">CA ok? (under 5%)</Form.Label>
              <Form.Control
                type="text"
                className="w-50"
                disabled
                value={calcCAError(ele.id) < 3 ? 'Ok' : 'FAIL'}
              />
            </Form.Group>
            <div className="col" />
          </div>
        </div>
      ))}
    </>
  );
  return (
    <>
      <div className="d-flex flex-row my-1">
        <Form.Group className="col mx-2">
          <Form.Label className="h6 my-auto">
            Voltmeter used: (Vendor-Model number-Asset Tag)
          </Form.Label>
          <div className="">
            <input type="text" disabled value={loadBankData.voltMeter} />
          </div>
        </Form.Group>
        <Form.Group className="col mx-2">
          <Form.Label className="h6 my-auto">
            Current shunt meter used: (Vendor-Model number-Asset Tag)
          </Form.Label>
          <div className="">
            <input type="text" disabled value={loadBankData.shuntMeter} />
          </div>
        </Form.Group>
      </div>
      <div className="d-flex flex-row">
        <div className="col">
          <div className="form-check form-switch">
            <label className="form-check-label mx-2 h6">Visual check ok</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={loadBankData.visualCheckOk}
              disabled
            />
          </div>
        </div>
        <div className="col">
          <div className="form-check form-switch">
            <label className="form-check-label mx-2 h6">Connected to DC</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={loadBankData.connectedToDC}
              disabled
            />
          </div>
        </div>
        <div className="col">
          <div className="form-check form-switch">
            <label className="form-check-label mx-2 h6">
              Low voltage cutoff
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={loadBankData.voltageCutoffOk}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="d-flex flex-row">
        <div className="col">
          <div className="form-check form-switch">
            <label className="form-check-label mx-2 h6">Alarm ok</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={loadBankData.alarmOk}
              disabled
            />
          </div>
        </div>
        <div className="col">
          <div className="form-check form-switch">
            <label className="form-check-label mx-2 h6">Recorded data ok</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={loadBankData.recordedDataOk}
              disabled
            />
          </div>
        </div>
        <div className="col">
          <div className="form-check form-switch">
            <label className="form-check-label mx-2 h6">Printer ok</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={loadBankData.printerOk}
              disabled
            />
          </div>
        </div>
      </div>
      {loadStepsTable}
      <div className="my-2">
        <div className="row">
          <Form.Group className="col">
            <Form.Label className="h6 my-auto">
              Voltage reported [V] (from display)
            </Form.Label>
            <Form.Control
              name="vr"
              type="number"
              className="w-50"
              disabled
              min={0}
              value={loadBankData.voltageReading.vr}
            />
            <Form.Control.Feedback type="invalid">
              Adjust ppm setting to fix, then check again
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col">
            <Form.Label className="h6 my-auto">
              Voltage actual [V] (from voltmeter)
            </Form.Label>
            <Form.Control
              name="va"
              type="number"
              disabled
              min={0}
              className="w-50"
              value={loadBankData.voltageReading.va}
            />
            <Form.Control.Feedback type="invalid">
              Too much sag. Check DC source and redo calibration
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col">
            <Form.Label className="h6 my-auto">Test voltage [V]</Form.Label>
            <Form.Control type="number" className="w-50" disabled value={48} />
          </Form.Group>
        </div>
        <div className="row">
          <Form.Group className="col">
            <Form.Label className="h6 my-auto">VR error [%]</Form.Label>
            <Form.Control
              type="text"
              className="w-50"
              disabled
              value={loadBankData.voltageReading.vrError}
            />
            <Form.Label className="h6 my-auto">VR ok? (under 1%)</Form.Label>
            <Form.Control
              type="text"
              className="w-50"
              disabled
              value={loadBankData.voltageReading.vrOk ? 'Ok' : 'FAIL'}
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Label className="h6 my-auto">VA error [%]</Form.Label>
            <Form.Control
              type="text"
              className="w-50"
              disabled
              value={loadBankData.voltageReading.vaError}
            />
            <Form.Label className="h6 my-auto">VA ok? (under 10%)</Form.Label>
            <Form.Control
              type="text"
              className="w-50"
              disabled
              value={loadBankData.voltageReading.vaOk ? 'Ok' : 'FAIL'}
            />
          </Form.Group>
          <div className="col" />
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line no-lone-blocks
{ /* <div className="row">
        <Form.Group className="col">
          <Form.Label className="h6 my-auto">
            CR: Current reported [A] (from display)
          </Form.Label>
          <Form.Control
            name="cr"
            type="number"
            min={0}
            className="w-50"
            value={
              loadBankData.currentReadings.filter((element) => element.id === step)[0].cr
            }
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
            value={
              loadBankData.currentReadings.filter((element) => element.id === step)[0].ca
            }
          />
          <Form.Control.Feedback type="invalid">
            Check and repair/replace load cell, then restart
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col">
          <Form.Label className="h6 my-auto">Ideal current [A]</Form.Label>
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
          <Form.Label className="h6 my-auto">CR ok? (under 3%)</Form.Label>
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
          <Form.Label className="h6 my-auto">CA ok? (under 5%)</Form.Label>
          <Form.Control
            type="text"
            className="w-50"
            disabled
            value={calcCAError(step) < 3 ? 'Ok' : 'FAIL'}
          />
        </Form.Group>
        <div className="col" />
      </div> */ }
