/*
This class deals with how to display lots of calibration events
*/
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import CalibrationRow from './CalibrationRow';
import MouseOverPopover from './PopOver';

export default function CalibrationTable({
  rows, addRow, deleteRow, onChangeCalibRow,
}) {
  CalibrationTable.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    addRow: PropTypes.func.isRequired,
    deleteRow: PropTypes.func.isRequired,
    onChangeCalibRow: PropTypes.func.isRequired,
  };
  // This list maps all the entries in an array to a calibration row
  const list = rows.map((entry) => (
    <CalibrationRow
      key={entry.id}
      handleDelete={deleteRow}
      id={entry.id}
      onChangeCalibRow={onChangeCalibRow}
      comment={entry.comment}
      date={entry.date}
      entry={entry}
    />
  ));
  return (
    <Form className="needs-validation bg-light rounded" noValidate>
      {list}
      <div className="d-flex justify-content-center">
        <Button variant="primary" onClick={addRow} className="my-2">
          <MouseOverPopover message="Add new row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-node-plus-fill"
              viewBox="0 0 16 16"
            >
              {/* eslint-disable-next-line max-len */}
              <path d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 1 0z" />
            </svg>
          </MouseOverPopover>
        </Button>
      </div>
    </Form>
  );
}
