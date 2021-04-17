/* eslint-disable no-unused-vars */
import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import InstrumentForm from './InstrumentForm';
import MouseOverPopover from './PopOver';
import TableLoadBank from './TableLoadBank';
import KlufeDetailedView from './KlufeDetailedView';
import ApproveCalibEvent from '../queries/ApproveCalibEvent';
import RejectCalibEvent from '../queries/RejectCalibEvent';
import CustomFormEntry from './CustomFormEntry';

export default function DetailedCalibrationView({
  selectedRow, isForInstrumentPage = false, approverId, onBtnClick = () => undefined,
}) {
  DetailedCalibrationView.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    selectedRow: PropTypes.object.isRequired, // the selected row is the calibration event
    // eslint-disable-next-line react/require-default-props
    isForInstrumentPage: PropTypes.bool, // if true, this will make the component hide instrument info and approve/deny buttons
    approverId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/require-default-props
    onBtnClick: PropTypes.func,
  };
  const [approvalComment, setApprovalComment] = React.useState('');
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
  const approvalDate = new Date().toISOString().split('T')[0];
  const handleResponse = (response) => {
    if (response.success) {
      toast.success(response.message, {
        toastId: Math.random(),
      });
      onBtnClick();
    } else {
      toast.error(response.message, {
        toastId: Math.random(),
      });
    }
  };

  const displayCalibratedBy = (
    <ul className="list-group ms-4 mb-2">
      {selectedRow.calibratedBy.length > 0 && (
        <span className="h6">Calibrated by:</span>
      )}
      {selectedRow.calibratedBy.map((ele) => (
        <li
          key={ele.assetTag}
          className="list-group-item bg-grey rounded my-1"
          style={{ boxShadow: '5px 5px 2px #888888' }}
        >
          <div className="row">
            <div className="col-md">
              <span className="h6">Vendor</span>
              <br />
              <input
                className="form-control mt-1"
                disabled
                value={ele.vendor}
                type="text"
              />
            </div>
            <div className="col-md">
              <span className="h6">Model Number</span>
              <br />
              <input
                className="form-control mt-1"
                disabled
                value={ele.modelNumber}
                type="text"
              />
            </div>
            <div className="col-md">
              <span className="h6">Asset Tag</span>
              <br />
              <input
                className="form-control mt-1"
                disabled
                value={ele.assetTag}
                type="text"
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
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
        {selectedRow.fileName && ( // if there was a file upload, display it
          <a
            href={`../data/${selectedRow.fileLocation}`}
            download={selectedRow.fileName}
            className="ms-4 my-2"
          >
            {selectedRow.fileName}
          </a>
        )}
        {displayCalibratedBy}
        {getCalibrationType() === 'Load Bank' && (
          <TableLoadBank loadBankData={JSON.parse(selectedRow.loadBankData)} />
        )}
        {/* TODO: dynamically render any instruments used in calibration */}
        {getCalibrationType() === 'Plain'
          && selectedRow.calibratedBy.length === 0 && !selectedRow.fileName && ( // plain & no file upload & no instruments used in calib event => no data
          <div className="ms-4">No data on record</div>

        )}
        {getCalibrationType() === 'Klufe' && (
          <KlufeDetailedView klufeData={JSON.parse(selectedRow.klufeData)} />
        )}
        {getCalibrationType() === 'Custom' && (
          <CustomFormEntry
            getSteps={() => JSON.parse(selectedRow.customFormData)}
            modelNumber={selectedRow.modelNumber}
            serialNumber={selectedRow.serialNumber}
            assetTag={selectedRow.assetTag}
            vendor={selectedRow.vendor}
          />
        )}
      </div>
      {/* {isForInstrumentPage && selectedRow.approvalStatus === 3 && (
        <div className="row mx-3 my-3 pt-3 border-top border-dark">
          <div className="col">
            <span className="h5">Approval Data</span>
            <br />
            <div className="ms-4 pt-1">
              This calibration event happened before approval was required.
            </div>
          </div>
        </div>
      )} */}
      {isForInstrumentPage
        && (selectedRow.approvalStatus === 1
          || selectedRow.approvalStatus === 2) && ( // approvalStatus = 1 means this event was approved; 0=awaiting, 3=no approval, 2=rejected
          <>
            <div className="row mx-3 mt-3 pt-3 border-top border-dark">
              <div className="col">
                <span className="h5">Approver</span>
                <br />
                <input
                  className="form-control mt-1"
                  disabled
                  value={`${selectedRow.approverFirstName} ${selectedRow.approverLastName}`}
                  type="text"
                />
              </div>
              <div className="col">
                <span className="h5">Approver Username</span>
                <br />
                <input
                  className="form-control mt-1"
                  disabled
                  value={selectedRow.approverUsername}
                  type="text"
                />
              </div>
              <div className="col">
                <span className="h5">Approval Date</span>
                <br />
                <input
                  className="form-control mt-1"
                  disabled
                  value={selectedRow.approvalDate}
                  type="text"
                />
              </div>
            </div>
            <div className="row mx-3 my-3 pt-3 border-top border-dark">
              <div className="col">
                <span className="h5">Approval Comment</span>
                <br />
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  value={selectedRow.approvalComment}
                  disabled
                />
              </div>
            </div>
          </>
      )}
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
                value={approvalComment}
                onChange={(e) => {
                  setApprovalComment(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row mx-3 mt-3 pt-3 border-top border-dark">
            <div className="col d-flex justify-content-center">
              <MouseOverPopover message="Approve this calibration event">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    ApproveCalibEvent({
                      handleResponse,
                      calibrationEventId: selectedRow.id,
                      approverId,
                      approvalDate,
                      approvalComment,
                    });
                  }}
                >
                  Approve
                </button>
              </MouseOverPopover>
              <span className="mx-3" />
              <MouseOverPopover message="Deny this calibration event">
                <button
                  type="button"
                  className="btn btn-delete"
                  onClick={() => {
                    RejectCalibEvent({
                      handleResponse,
                      calibrationEventId: selectedRow.id,
                      approverId,
                      approvalDate,
                      approvalComment,
                    });
                  }}
                >
                  Reject
                </button>
              </MouseOverPopover>
            </div>
          </div>
        </>
      )}
    </>
  );
}
