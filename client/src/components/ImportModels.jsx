import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { useStateWithCallbackInstant } from 'use-state-with-callback';
import PropTypes from 'prop-types';
import ModalAlert from './ModalAlert';
import ImportModelError from './ImportModelError';
import Query from './UseQuery';
import DisplayGrid from './UITable';

export default function ImportModels({ setLoading }) {
  ImportModels.propTypes = {
    setLoading: PropTypes.func.isRequired,
  };

  const [show, setShow] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [importCount, setImportCount] = useState(0);

  const [csvData, setCSVData] = useStateWithCallbackInstant([], () => {
    console.log('Updating CSV Data');
    if (csvData.length > 0) {
      setLoading(false);
      setImportCount(csvData.length);
      setShowTable(true);
      console.log(JSON.stringify(csvData));
    }
  });

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

  // TODO: Refactor this to reset the file selected
  const refreshPage = () => {
    window.location.reload();
  };

  const closeModal = () => {
    // refreshPage();
    setShow(false);
    setAllRowErrors([]);
    setAllQueryErrors([]);
  };

  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
    },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model-Number', width: 150 },
    { field: 'description', headerName: 'Short-Description', width: 240 },
    {
      field: 'comment',
      headerName: 'Comment',
      width: 300,
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    }, { field: 'calibrationFrequency', headerName: 'Calibration-Frequency', width: 200 },
  ];

  const IMPORT_MODELS = gql`
  mutation ImportModels (
    $filteredData: [ModelInput]!
  ) {
    bulkImportData(models: $filteredData)
  }
  `;

  const characterLimits = {
    model: {
      vendor: 30,
      modelNumber: 40,
      description: 100,
      comment: 2000,
      calibrationFrequency: 10,
    },
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => ((header === 'Short-Description') ? 'description' : camelCase(header)),
  };

  // NOTE: Headers have been modified by lodash to be camelCase for ease of import
  // const requiredHeaders = ['vendor', 'modelNumber', 'description'];

  // TODO: Refactor missingKey to be more pretty
  const getMissingKeys = (row) => {
    const missingKeys = [];
    if (!row.vendor) missingKeys.push('Vendor');
    if (!row.modelNumber) missingKeys.push('Model-Number');
    if (!row.description) missingKeys.push('Short-Description');
    return missingKeys.length > 0 ? missingKeys : null;
  };

  const checkDuplicateModel = (data, vendor, modelNumber, myIndex) => {
    let isDuplicateModel = false;
    data.forEach((row, index) => {
      if (index !== myIndex && row.vendor === vendor && row.modelNumber === modelNumber) {
        isDuplicateModel = true;
      }
    });
    return isDuplicateModel;
  };

  const validateRow = (row) => {
    // TODO: Make this less ugly
    const invalidKeys = [];
    if (row.vendor && row.vendor.length > characterLimits.model.vendor) {
      invalidKeys.push('Vendor');
    }
    if (row.modelNumber && row.modelNumber.length > characterLimits.model.modelNumber) {
      invalidKeys.push('Model-Number');
    }
    if (row.description && row.description.length > characterLimits.model.description) {
      invalidKeys.push('Short-Description');
    }
    if (row.comment && row.comment.length > characterLimits.model.comment) {
      invalidKeys.push('Comment');
    }
    if (row.calibrationFrequency && row.calibrationFrequency.length > characterLimits.model.calibrationFrequency) {
      invalidKeys.push('Calibration-Frequency');
    }
    return invalidKeys.length > 0 ? invalidKeys : null;
  };

  const validateCalibrationFrequency = (calibrationFrequency) => calibrationFrequency >= 0 || calibrationFrequency === 'N/A';

  let csvInputStyle = { color: 'red' };

  const refreshCSVReader = () => {
    csvInputStyle = { color: 'blue' };
  };

  const isEmptyLine = (obj) => {
    Object.values(obj).every((x) => (x === null || x === ''));
  };

  const handleCSVReader = (data /* , fileInfo */) => {
    console.log('Called handleCSVReader with data:');
    console.log(data);
    const importRowErrors = [];
    data.forEach((row, index) => {
      // Check missing keys
      if (!isEmptyLine(row)) {
        const missingKeys = getMissingKeys(row);

        let isDuplicateModel;
        if (row.vendor && row.modelNumber) {
          isDuplicateModel = checkDuplicateModel(data, row.vendor, row.modelNumber, index);
        }

        // Validate entries by length
        const invalidEntries = validateRow(row);

        // Validate calibration frequency
        const invalidCalibration = !validateCalibrationFrequency(row.calibrationFrequency);

        // If any errors exist, create errors object
        if (missingKeys || invalidEntries || invalidCalibration || isDuplicateModel) {
          const rowError = {
            data: row,
            row: index + 2,
            ...(missingKeys) && { missingKeys },
            ...(invalidEntries) && { invalidEntries },
            ...(isDuplicateModel) && { isDuplicateModel },
            ...(invalidCalibration) && { invalidCalibration },
          };
          importRowErrors.push(rowError);
        }
      }
    });

    // Show modal alert
    if (importRowErrors.length > 0) {
      setAllRowErrors(importRowErrors);
    } else {
      setLoading(true);
      // Now all fields have been validated, time to attempt a db push...
      const query = print(IMPORT_MODELS);
      const queryName = 'bulkImportData';

      let filteredData = data.map((obj) => ({
        vendor: String(obj.vendor),
        modelNumber: String(obj.modelNumber),
        description: String(obj.description),
        ...(obj.comment) && { comment: String(obj.comment) },
        ...(obj.calibrationFrequency !== 'N/A') && { calibrationFrequency: parseInt(obj.calibrationFrequency, 10) },
      }));

      const getVariables = () => ({ filteredData });
      const handleResponse = (response) => {
        setLoading(false);
        console.log(response);
        if (response.success === false) {
          console.log(response.errorList);
          setAllQueryErrors(response.errorList);
        } else {
          // Display data in data-grid component
          filteredData = filteredData.map((obj) => ({
            ...obj,
            id: String(obj.vendor + obj.modelNumber),
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

      // Refresh CSVReader component
      refreshCSVReader();
    }
  };

  return (
    <>
      <div>
        <CSVReader
          cssClass="m-2"
          cssLabelClass="label label-primary m-2"
          label="Import Models"
          onFileLoaded={handleCSVReader}
          onError={refreshPage}
          parserOptions={papaparseOptions}
          inputStyle={csvInputStyle}
          skipEmptyLines
          header
        />
      </div>
      <ModalAlert handleClose={closeModal} show={show} title="Error Importing Models">
        <ImportModelError allRowErrors={allRowErrors} errorList={allQueryErrors} />
      </ModalAlert>
      <div style={{
        display: showTable ? 'inline-block' : 'none',
        width: showTable ? '100%' : '0',
        height: 'auto',
      }}
      >
        <h2 className="m-2">
          {`Successfully Imported ${importCount} ${importCount === 1 ? 'Model' : 'Models'}`}
        </h2>
        <DisplayGrid rows={csvData} cols={cols} />
      </div>
    </>
  );
}
