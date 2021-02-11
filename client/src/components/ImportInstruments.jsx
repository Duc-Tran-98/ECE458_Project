import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { useStateWithCallbackInstant } from 'use-state-with-callback';
import moment from 'moment';
import ModalAlert from './ModalAlert';
import ImportInstrumentError from './ImportInstrumentError';
import Query from './UseQuery';

export default function ImportInstruments() {
  const [show, setShow] = useState(false);
  // const [allRowErrors, setAllRowErrors] = useState([]);
  const [allRowErrors, setAllRowErrors] = useStateWithCallbackInstant([], () => {
    if (allRowErrors.length > 0) {
      setShow(true);
    }
  });
  const [allQueryErrors, setAllQueryErrors] = useStateWithCallbackInstant([], () => {
    if (allQueryErrors.length > 0) {
      setShow(true);
    }
  });

  const closeModal = () => {
    setShow(false);
    setAllRowErrors([]);
    setAllQueryErrors([]);
  };

  const IMPORT_INSTRUMENTS = gql`
  mutation ImportInstruments (
    $dataWithUser: [InstrumentInput]!
  ) {
    bulkImportData(instruments: $dataWithUser)
  }
  `;

  const characterLimits = {
    instrument: {
      vendor: 30,
      modelNumber: 40,
      serialNumber: 40,
      comment: 2000,
      calibrationDate: 20,
      calibrationComment: 2000,
    },
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => camelCase(header),
  };

  // TODO: Refactor missingKey to be more pretty
  const getMissingKeys = (row) => {
    const missingKeys = [];
    if (!row.vendor) missingKeys.push('Vendor');
    if (!row.modelNumber) missingKeys.push('Model-Number');
    if (!row.serialNumber) missingKeys.push('Serial-Number');
    return missingKeys.length > 0 ? missingKeys : null;
  };

  const checkDuplicateInstrument = (data, vendor, modelNumber, serialNumber, myIndex) => {
    let isDuplicateInstrument = false;
    data.forEach((row, index) => {
      if (index !== myIndex && row.vendor === vendor && row.modelNumber === modelNumber && row.serialNumber === serialNumber) {
        isDuplicateInstrument = true;
      }
    });
    return isDuplicateInstrument;
  };

  // TODO: Assuming instrument is calibratable, check this later
  const validCalibrationDate = (calibrationDate) => {
    // Check if date is missing
    if (!calibrationDate) {
      return 'Missing Calibration-Date';
    }

    // Check if date is in correct form
    if (!moment(calibrationDate, 'MM/DD/YYYY', true)) {
      return 'Calibration-Date Incorrect Form';
    }

    // Check if date is in the future
    if (moment(calibrationDate).isAfter()) {
      return 'Calibration-Date is in the Future';
    }

    // No errors
    return null;
  };

  const validateRow = (row) => {
    // TODO: Make this less ugly
    const invalidKeys = [];
    if (row.vendor && row.vendor.length > characterLimits.instrument.vendor) {
      invalidKeys.push('Vendor');
    }
    if (row.modelNumber && row.modelNumber.length > characterLimits.instrument.modelNumber) {
      invalidKeys.push('Model-Number');
    }
    if (row.serialNumber && row.serialNumber.length > characterLimits.instrument.serialNumber) {
      invalidKeys.push('Serial-Number');
    }
    if (row.comment && row.comment.length > characterLimits.instrument.comment) {
      invalidKeys.push('Comment');
    }
    if (row.calibrationDate && row.calibrationDate.length > characterLimits.instrument.calibrationDate) {
      invalidKeys.push('Calibration-Date');
    }
    if (row.calibrationComment && row.calibrationComment.length > characterLimits.instrument.calibrationComment) {
      invalidKeys.push('Calibration-Comment');
    }
    return invalidKeys.length > 0 ? invalidKeys : null;
  };

  const handleCSVReader = (data /* , fileInfo */) => {
    const importRowErrors = [];
    data.forEach((row, index) => {
      console.log(row);
      // Check missing keys
      const missingKeys = getMissingKeys(row);

      let isDuplicateInstrument;
      if (row.vendor && row.modelNumber && row.serialNumber) {
        isDuplicateInstrument = checkDuplicateInstrument(data, row.vendor, row.modelNumber, row.serialNumber, index);
      }

      // Validate entries by length
      const invalidEntries = validateRow(row);

      // Validate calibration date (missing, form, future)
      const invalidCalibrationDate = validCalibrationDate(row.calibrationDate);

      // If any errors exist, create errors object
      if (missingKeys || invalidEntries || invalidCalibrationDate || isDuplicateInstrument) {
        const rowError = {
          data: row,
          row: index + 2,
          ...(missingKeys) && { missingKeys },
          ...(invalidEntries) && { invalidEntries },
          ...(isDuplicateInstrument) && { isDuplicateInstrument },
          ...(invalidCalibrationDate) && { invalidCalibrationDate },
        };
        importRowErrors.push(rowError);
      }
    });

    // Show modal alert
    if (importRowErrors.length > 0) {
      setAllRowErrors(importRowErrors);
    } else {
      // Now all fields have been validated, time to attempt a db push...
      const query = print(IMPORT_INSTRUMENTS);
      const queryName = 'bulkImportData';

      // Append calibrationUser to format
      const dataWithUser = data.map((obj) => ({
        ...obj,
        calibrationUser: 'admin',
        calibrationDate: moment(obj.calibrationDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
      }));

      console.log(dataWithUser);

      const getVariables = () => ({ dataWithUser });
      const handleResponse = (response) => {
        console.log(response);
        // TODO: If response is an error, post Modal Alert
        if (response.success === false) {
          console.log(response.errorList);
          setAllQueryErrors(response.errorList);
        }
      };
      Query({
        query,
        queryName,
        getVariables,
        handleResponse,
      });
    }
  };

  return (
    <>
      <ModalAlert handleClose={closeModal} show={show} title="Error Importing Instruments">
        <ImportInstrumentError allRowErrors={allRowErrors} errorList={allQueryErrors} />
      </ModalAlert>
      {/* Another component inside to dynamically render information */}
      <CSVReader
        cssClass="csv-reader-input m-2"
        cssLabelClass="label label-primary m-2"
        label="Import Instruments"
        onFileLoaded={handleCSVReader}
        // onError={this.handleDarkSideForce}
        parserOptions={papaparseOptions}
        inputStyle={{ color: 'red' }}
        skipEmptyLines
        header
      />
    </>
  );
}
