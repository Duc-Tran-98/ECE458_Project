import React from 'react';
import PropTypes from 'prop-types';

export default function ImportModelError({ allRowErrors, errorList }) {
  ImportModelError.propTypes = {
    allRowErrors: PropTypes.instanceOf(Array).isRequired,
    errorList: PropTypes.instanceOf(Array).isRequired,
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
        {`Duplicate Model: (${rowError.data.vendor}, ${rowError.data.modelNumber})`}
      </li>
      )}
      {rowError.invalidCalibration && (
      <li>
        {`Unable to parse Calibration-Frequency: (${rowError.data.calibrationFrequency})`}
      </li>
      )}
    </div>

  );

  const createParseErrorsList = allRowErrors.map(((rowError) => (
    <li key={rowError.row}>
      Row #
      {rowError.row}
      <ul>{formatErrorLine(rowError)}</ul>
    </li>
  )
  ));

  const createQueryErrorsList = errorList.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <li key={index}>
      {element}
    </li>
  ));

  return (
    <>
      <p>Please fix the below errors and try again!</p>
      {errorList.length > 0 && <ul className="text-danger">{createQueryErrorsList}</ul>}
      {allRowErrors.length > 0 && <ul className="text-danger">{createParseErrorsList}</ul>}
    </>
  );
}
