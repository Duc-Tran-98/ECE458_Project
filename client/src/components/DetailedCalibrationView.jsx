import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import InstrumentForm from './InstrumentForm';
import MouseOverPopover from './PopOver';
import TableLoadBank from './TableLoadBank';
import KlufeDetailedView from './KlufeDetailedView';

export default function DetailedCalibrationView({ selectedRow, isForInstrumentPage = false }) {
  DetailedCalibrationView.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    selectedRow: PropTypes.object.isRequired, // the selected row is the calibration event
    // eslint-disable-next-line react/require-default-props
    isForInstrumentPage: PropTypes.bool, // if true, this will make the component hide instrument info and approve/deny buttons
  };
  const getCalibrationType = () => {
    if (selectedRow.loadBankData) {
      return 'Load Bank';
    }
    if (selectedRow.klufeData) {
      return 'Klufe';
    }
    if (selectedRow.customFormData) {
      return 'Custom';
    }
    return 'Plain';
  };
  return (
    <>
      {!isForInstrumentPage && (
        <>
          <h3 className="px-3 bg-secondary text-light my-auto">
            Instrument Information
          </h3>
          <InstrumentForm
            modelNumber={selectedRow.modelNumber}
            vendor={selectedRow.vendor}
            comment=""
            serialNumber={selectedRow.serialNumber}
            categories={[]}
            viewOnly
            description={selectedRow.description}
            calibrationFrequency={selectedRow.calibrationFrequency}
            assetTag={selectedRow.assetTag}
            hideLongFields
            type="view"
          />
          <h3 className="px-3 bg-secondary text-light mt-3">
            Calibration Information
          </h3>
        </>
      )}
      <div className="row mx-3 pt-2">
        <div className="col">
          <span className="h5">Calibration Type</span>
          <br />
          <input
            className="form-control mt-1"
            disabled
            value={getCalibrationType()}
            type="text"
          />
        </div>
        <div className="col">
          <span className="h5">User</span>
          <br />
          <input
            className="form-control mt-1"
            disabled
            value={selectedRow.user}
            type="text"
          />
        </div>
        <div className="col">
          <span className="h5">Date</span>
          <br />
          <input
            className="form-control mt-1"
            disabled
            value={selectedRow.date}
            type="text"
          />
        </div>
      </div>
      <div className="row mx-3 mt-3 pt-3 border-top border-dark">
        <div className="col">
          <span className="h5">Calibration Comment</span>
          <br />
          <Form.Control
            as="textarea"
            rows={3}
            name="comment"
            value={selectedRow.comment}
            disabled
          />
        </div>
      </div>
      <div className="row mx-3 mt-3 pt-3 border-top border-dark">
        <span className="h5">Calibration Data</span>
        <br />
        {getCalibrationType() === 'Load Bank' && (
          <TableLoadBank loadBankData={JSON.parse(selectedRow.loadBankData)} />
        )}
        {/* TODO: dynamically render any instruments used in calibration */}
        {getCalibrationType() === 'Plain' && (
          <div className="ms-4">No data on record</div>
        )}
        {getCalibrationType() === 'Klufe' && (
          <KlufeDetailedView klufeData={JSON.parse(selectedRow.klufeData)} />
        )}
      </div>
      {!isForInstrumentPage && (
        <>
          <div className="row mx-3 mt-3 pt-3 border-top border-dark">
            <div className="col">
              <span className="h5">Approval Comment</span>
              <br />
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                id="approvalCommentInput"
              />
            </div>
          </div>
          <div className="row mx-3 mt-3 pt-3 border-top border-dark">
            <div className="col d-flex justify-content-center">
              <MouseOverPopover message="Approve this calibration event">
                <button type="button" className="btn">
                  Approve
                </button>
              </MouseOverPopover>
              <span className="mx-3" />
              <MouseOverPopover message="Deny this calibration event">
                <button type="button" className="btn btn-delete">
                  Deny
                </button>
              </MouseOverPopover>
            </div>
          </div>
        </>
      )}
    </>
  );
}
