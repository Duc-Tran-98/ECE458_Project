import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { camelCase } from 'lodash';
import ModalAlert from './ModalAlert';
// import { gql } from '@apollo/client';
// import { print } from 'graphql';
// import Query from './UseQuery';

export default function ImportModels() {
  // mutation {
  //   bulkImportData(
  //     models: [
  //         {vendor: "a", modelNumber: "mod1", description: "1", comment: "comment", calibrationFrequency: 1},
  //       {vendor: "b", modelNumber: "mod1", description: "2"},
  //         {vendor: "c", modelNumber: "mod1", description: "3", comment: "third model", calibrationFrequency: 12},
  //     ]

  const [show, setShow] = useState(false);
  const closeModal = () => {
    setShow(false);
  };

  // TODO: Fix gql query
  // const IMPORT_MODELS = gql`
  //   type ModelType {
  //     vendor: String!
  //     modelNumber: String!
  //     shortDescription: String!
  //     comment: String
  //     calibrationFrequency: Int
  //   }
  //   input ModelInput {
  //     vendor: String!
  //     modelNumber: String!
  //     shortDescription: String!
  //     comment: String
  //     calibrationFrequency: Int
  //   }
  //   mutation ImportModels(
  //     $data: [ModelInput]!
  //   ) {
  //     bulkImportData(
  //       models: [ModelInput]
  //     )
  //   }
  // `;

  // FIXME: Might need to add instruments to bulk import query
  // var MovieSchema = `
  // type Movie {
  //  name: String
  // }
  // input MovieInput {
  //  name: String
  // }
  // mutation {
  //  addMovies(movies: [MovieInput]): [Movie]
  // }
  // `

  const characterLimits = {
    model: {
      vendor: 30,
      modelNumber: 40,
      shortDescription: 100,
      comment: 2000,
      calibrationFrequency: 10,
    },
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => camelCase(header),
  };

  // NOTE: Headers have been modified by lodash to be camelCase for ease of import
  const requiredHeaders = ['vendor', 'modelNumber', 'shortDescription'];

  // TODO: Refactor missingKey to match original import
  const getMissingKeys = (row, keys) => {
    const missingKeys = [];
    keys.forEach((item) => {
      if (!row[item]) {
        missingKeys.push(item);
      }
    });
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
    if (row.shortDescription && row.shortDescription.length > characterLimits.model.shortDescription) {
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
    const allRowErrors = [];
    data.forEach((row, index) => {
      // Check missing keys
      const missingKeys = getMissingKeys(row, requiredHeaders);

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
        allRowErrors.push(rowError);
      }
    });

    console.log('All Row Errors: ');
    console.log(allRowErrors);

    // // Now all fields have been validated, time to attempt a db push...
    // const query = print(IMPORT_MODELS);
    // const queryName = 'bulkImportData';

    // const getVariables = () => ({
    //   data,
    // });
    // const handleResponse = (response) => {
    //   console.log('Query Response:');
    //   console.log(response);
    // };
    // console.log('Sending query for bulk import...');
    // Query({
    //   query,
    //   queryName,
    //   getVariables,
    //   handleResponse,
    // });
  };

  return (
    <>
      <ModalAlert handleClose={closeModal} show={show} title="Error Message">
        <h2>This is an error header</h2>
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
