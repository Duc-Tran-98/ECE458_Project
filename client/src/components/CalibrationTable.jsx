/* eslint-disable react/require-default-props */
/*
This class deals with how to display lots of calibration events
*/
import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import CalibrationRow from './CalibrationRow';
import DataGrid from './UITable';
import { cols } from '../utils/CalibTable';

export default function CalibrationTable({
  // eslint-disable-next-line no-unused-vars
  rows,
  deleteRow,
  onChangeCalibRow,
  showSaveButton,
  onSaveClick = () => undefined,
  showDeleteBtn = true,
  vendor,
  modelNumber,
}) {
  CalibrationTable.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    deleteRow: PropTypes.func.isRequired,
    onChangeCalibRow: PropTypes.func.isRequired,
    showSaveButton: PropTypes.bool, // whether or not to show a save button on rows
    onSaveClick: PropTypes.func, // what to call when save button clicked
    // eslint-disable-next-line react/require-default-props
    showDeleteBtn: PropTypes.bool,
    vendor: PropTypes.string,
    modelNumber: PropTypes.string,
  };
  CalibrationTable.defaultProps = {
    showSaveButton: false,
    vendor: '',
    modelNumber: '',
  };
  // This list maps all the entries in an array to a calibration row
  const list = rows.map((entry) => (
    <CalibrationRow
      vendor={vendor}
      modelNumber={modelNumber}
      showDeleteBtn={showDeleteBtn}
      key={entry.id}
      handleDelete={deleteRow}
      id={entry.id}
      onChangeCalibRow={onChangeCalibRow}
      comment={entry.comment || ''}
      fileName={entry.fileName}
      fileLocation={entry.fileLocation}
      loadBankData={entry.loadBankData}
      klufeData={entry.klufeData}
      date={entry.date}
      file={entry.file}
      entry={entry}
      showSaveButton={showSaveButton}
      onSaveClick={onSaveClick}
    />
  ));
  return (
    <Form className="needs-validation my-3" noValidate>
      {rows.length > 0 ? (
        list
      ) : (
        <div className="row">
          <p className="text-center h5">Item not calibrated</p>
        </div>
      )}
    </Form>
  );
}

export function TabCalibrationTable({
  cellHandler,
  rows,
  requiresCalibrationApproval,
}) {
  TabCalibrationTable.propTypes = {
    cellHandler: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    requiresCalibrationApproval: PropTypes.bool.isRequired,
  };
  const [which, setWhich] = React.useState('All');
  const [localRows, setLocalRows] = React.useState(rows);

  // Approval states
  // 0 - awaiting approval
  // 1 - approved
  // 2 - rejected
  // 3 - no approval required
  const getRows = (type) => {
    if (requiresCalibrationApproval) {
      let copyOfResponse;
      switch (type) {
        case 'Approved':
          // eslint-disable-next-line no-case-declarations
          copyOfResponse = rows?.filter(
            (ele) => ele.approvalStatus === 3 || ele.approvalStatus === 1,
          );
          setLocalRows(copyOfResponse);
          return copyOfResponse;
        case 'Rejected':
          // eslint-disable-next-line no-case-declarations
          copyOfResponse = rows?.filter((ele) => ele.approvalStatus === 2);
          setLocalRows(copyOfResponse);
          return copyOfResponse;
        case 'Pending':
          // eslint-disable-next-line no-case-declarations
          copyOfResponse = rows?.filter((ele) => ele.approvalStatus === 0);
          setLocalRows(copyOfResponse);
          return copyOfResponse;
        default:
          setLocalRows(rows);
          return rows;
      }
    } else {
      setLocalRows(rows);
      return rows;
    }
  };

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (active) {
        getRows(which);
        // setLocalRows(rows);
      }
    })();
    return () => {
      active = false;
    };
  }, [rows]);

  const contentToDisplay = requiresCalibrationApproval ? (
    <>
      <div className="bg-offset" />
      <DataGrid
        rows={localRows}
        cols={cols}
        cellHandler={(e) => cellHandler(e)}
        additionalClassName="h-100"
        footer={(
          <div className="btn-group dropdown">
            {/* This is for the drop up of how many user can select */}
            <button
              className="btn dropdown-toggle"
              type="button"
              id="calibrationTableDropDownMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {which}
            </button>
            <ul
              className="dropdown-menu bg-light"
              aria-labelledby="calibrationTableDropDownMenu"
            >
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setWhich('All');
                    getRows('All');
                  }}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setWhich('Approved');
                    getRows('Approved');
                  }}
                >
                  Approved
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setWhich('Rejected');
                    getRows('Rejected');
                  }}
                >
                  Rejected
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setWhich('Pending');
                    getRows('Pending');
                  }}
                >
                  Pending
                </button>
              </li>
            </ul>
          </div>
        )}
      />
    </>
  ) : (
    <DataGrid rows={rows} cols={cols} cellHandler={(e) => cellHandler(e)} />
  );

  return <>{contentToDisplay}</>;
}

/*
<CalibrationRow
          handleDelete={deleteRow}
          id={entry.id}
          onChangeCalibRow={onChangeCalibRow}
          comment={entry.comment}
          date={entry.date}
          entry={entry}
        />
*/
