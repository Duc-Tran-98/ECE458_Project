/* eslint-disable react/require-default-props */
/*
This class deals with how to display lots of calibration events
*/
import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import CalibrationRow from './CalibrationRow';

export default function CalibrationTable({
  // eslint-disable-next-line no-unused-vars
  rows,
  deleteRow,
  onChangeCalibRow,
  showSaveButton,
  onSaveClick = () => undefined,
  showDeleteBtn = true,
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
  };
  CalibrationTable.defaultProps = {
    showSaveButton: false,
  };
  // This list maps all the entries in an array to a calibration row
  const list = rows.map((entry) => (
    <CalibrationRow
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
