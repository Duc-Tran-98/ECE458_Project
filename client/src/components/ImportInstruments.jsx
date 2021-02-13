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
import DisplayGrid from './UITable';

export default function ImportInstruments() {
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [importCount, setImportCount] = useState(0);

  const [csvData, setCSVData] = useStateWithCallbackInstant([], () => {
    console.log('Updating CSV Data');
    if (csvData.length > 0) {
      setImportCount(csvData.length);
      setShowTable(true);
      console.log(JSON.stringify(csvData));
    }
  });

  const [allRowErrors, setAllRowErrors] = useStateWithCallbackInstant([], () => {
    if (allRowErrors.length > 0) {
      setShowModal(true);
    }
  });
  const [allQueryErrors, setAllQueryErrors] = useStateWithCallbackInstant([], () => {
    if (allQueryErrors.length > 0) {
      setShowModal(true);
    }
  });

  const refreshPage = () => {
    window.location.reload();
  };

  const closeModal = () => {
    refreshPage();
    setShowModal(false);
    setAllRowErrors([]);
    setAllQueryErrors([]);
  };

  const IMPORT_INSTRUMENTS = gql`
  mutation ImportInstruments (
    $filteredData: [InstrumentInput]!
  ) {
    bulkImportData(instruments: $filteredData)
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

  // TODO: hide certain columns for successfuly rendering

  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
    },
    { field: 'vendor', headerName: 'Vendor', width: 120 },
    { field: 'modelNumber', headerName: 'Model-Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 225 },
    { field: 'serialNumber', headerName: 'Serial-Number', width: 150 },
    { field: 'comment', headerName: 'Comment', width: 250 },
    { field: 'calibrationUser', headerName: 'Calib-User', width: 150 },
    { field: 'calibrationDate', headerName: 'Calib-Date', width: 150 },
    { field: 'calibrationComment', headerName: 'Calib-Comment', width: 300 },

  ];

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
  // const validCalibrationDate = (calibrationDate) => {
  //   // Check if date is missing
  //   if (!calibrationDate) {
  //     return 'Missing Calibration-Date';
  //   }

  //   // Check if date is in correct form
  //   if (!moment(calibrationDate, 'MM/DD/YYYY', true)) {
  //     return 'Calibration-Date Incorrect Form';
  //   }

  //   // Check if date is in the future
  //   if (moment(calibrationDate).isAfter()) {
  //     return 'Calibration-Date is in the Future';
  //   }

  //   // No errors
  //   return null;
  // };

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
      // const invalidCalibrationDate = validCalibrationDate(row.calibrationDate);

      // If any errors exist, create errors object
      // if (missingKeys || invalidEntries || invalidCalibrationDate || isDuplicateInstrument) {
      if (missingKeys || invalidEntries || isDuplicateInstrument) {
        const rowError = {
          data: row,
          row: index + 2,
          ...(missingKeys) && { missingKeys },
          ...(invalidEntries) && { invalidEntries },
          ...(isDuplicateInstrument) && { isDuplicateInstrument },
          // ...(invalidCalibrationDate) && { invalidCalibrationDate },
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

      // TODO: Handle model with no calibration (more special cases)
      // Append calibrationUser to format
      let filteredData = data.map((obj) => ({
        vendor: String(obj.vendor),
        modelNumber: String(obj.modelNumber),
        serialNumber: String(obj.serialNumber),
        ...(obj.comment) && { comment: String(obj.comment) },
        ...(obj.calibrationDate) && { calibrationUser: 'admin' },
        ...(obj.calibrationDate) && { calibrationDate: moment(obj.calibrationDate, 'MM/DD/YYYY').format('YYYY-MM-DD') },
        ...(obj.calibrationDate && obj.calibrationComment) && { calibrationComment: obj.calibrationComment },
      }));

      const getVariables = () => ({ filteredData });
      const handleResponse = (response) => {
        console.log(response);
        if (response.success === false) {
          console.log(response.errorList);
          setAllQueryErrors(response.errorList);
        } else {
          // Display data in data-grid component
          filteredData = filteredData.map((obj) => ({
            ...obj,
            id: String(obj.vendor + obj.modelNumber + obj.serialNumber),
          }));
          setCSVData(filteredData);
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
      <ModalAlert handleClose={closeModal} show={showModal} title="Error Importing Instruments">
        <ImportInstrumentError allRowErrors={allRowErrors} errorList={allQueryErrors} />
      </ModalAlert>
      {/* Another component inside to dynamically render information */}
      <CSVReader
        cssClass="csv-reader-input m-2"
        cssLabelClass="label label-primary m-2"
        label="Import Instruments"
        onFileLoaded={handleCSVReader}
        onError={refreshPage}
        parserOptions={papaparseOptions}
        inputStyle={{ color: 'red' }}
        skipEmptyLines
        header
      />
      <div style={{
        display: showTable ? 'inline-block' : 'none',
        width: showTable ? '100%' : '0',
      }}
      >
        <h2>
          Successfully Imported
          {' '}
          {importCount}
          {' '}
          Instruments!
        </h2>
        <DisplayGrid rows={csvData} cols={cols} />
      </div>
    </>
  );
}
