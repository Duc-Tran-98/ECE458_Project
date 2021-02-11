import React from 'react';
import PropTypes from 'prop-types';

export default function ImportError({ allRowErrors }) {
  ImportError.propTypes = {
    allRowErrors: PropTypes.instanceOf(Array).isRequired,
  };

  const formatErrorLine = (rowError) => (
    <div>
      {rowError.missingKeys && (
      <li>
        {`Missing Keys: ${rowError.missingKeys}`}
      </li>
      )}
      {rowError.invalidEntries && (
      <li>
        {`Invalid Enties: ${rowError.invalidEntries}`}
      </li>
      )}
      {rowError.isDuplicateModel && (
      <li>
        Duplicate Model
        {` (${rowError.data.vendor}, ${rowError.data.modelNumber})`}
      </li>
      )}
      {rowError.invalidCalibration && (
      <li>
        Unable to parse Calibration-Frequency
        {` (${rowError.data.calibrationFrequency})`}
      </li>
      )}
    </div>

  );

  const errorItems = allRowErrors.map(((rowError) => (
    <li key={rowError.row}>
      Row #
      {rowError.row}
      <ul>{formatErrorLine(rowError)}</ul>
    </li>
  )
  ));

  return (
    <>
      <p>Please fix the below errors and try again!</p>
      <ul className="text-danger">{errorItems}</ul>

    </>
  );
}
