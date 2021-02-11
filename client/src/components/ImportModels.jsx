import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { useStateWithCallbackInstant } from 'use-state-with-callback';
import ModalAlert from './ModalAlert';
import ImportError from './ImportError';
import Query from './UseQuery';

export default function ImportModels() {
  const [show, setShow] = useState(false);
  // const [allRowErrors, setAllRowErrors] = useState([]);
  const [allRowErrors, setAllRowErrors] = useStateWithCallbackInstant([], () => {
    if (allRowErrors.length > 0) {
      setShow(true);
    }
  });
  const closeModal = () => {
    setShow(false);
    setAllRowErrors([]);
  };

  const IMPORT_MODELS = gql`
  mutation ImportModels (
    $data: [ModelInput]!
  ) {
    bulkImportData(models: $data)
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

  const handleCSVReader = (data /* , fileInfo */) => {
    const importRowErrors = [];
    data.forEach((row, index) => {
      // Check missing keys
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
    });

    // Show modal alert
    if (importRowErrors.length > 0) {
      setAllRowErrors(importRowErrors);
    } else {
      console.log('Sending bulk model import request to databse with data: ');
      console.log(data);
      // Now all fields have been validated, time to attempt a db push...
      const query = print(IMPORT_MODELS);
      const queryName = 'bulkImportData';

      const getVariables = () => ({
        data,
      });
      const handleResponse = (response) => {
        console.log(response);
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
      <ModalAlert handleClose={closeModal} show={show} title="Error Importing Models">
        <ImportError allRowErrors={allRowErrors} />
      </ModalAlert>
      {/* Another component inside to dynamically render information */}
      <CSVReader
        cssClass="csv-reader-input m-2 primary"
        label=""
        onFileLoaded={handleCSVReader}
        // onError={this.handleDarkSideForce}
        parserOptions={papaparseOptions}
        inputId="ObiWan"
        inputStyle={{ color: 'red' }}
        skipEmptyLines
        header
      />
    </>
  );
}
