import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from './UseQuery';
import ModalAlert from './ModalAlert';

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
  const IMPORT_MODELS = gql`
    type ModelType {
      vendor: String!
      modelNumber: String!
      shortDescription: String!
      comment: String
      calibrationFrequency: Int
    }
    input ModelInput {
      vendor: String!
      modelNumber: String!
      shortDescription: String!
      comment: String
      calibrationFrequency: Int
    }
    mutation ImportModels(
      $data: [ModelInput]!
    ) {
      bulkImportData(
        models: [ModelInput]
      )
    }  
  `;

  // FIXME: Might need to add instruments to bulk import query

  // const IMPORT_MODELS = gql`
  //     mutation ImportModels(
  //         $vendor: String!
  //         $modelNumber: String!
  //         $shortDescription: String!
  //         $comment: String!
  //         $calibrationFrequency: Int!
  //       ) {
  //         bulkImportData(
  //           vendor: $vendor
  //           modelNumber: $modelNumber
  //           description: $shortDescription
  //           comment: $comment
  //           calibrationFrequency: $calibrationFrequency
  //         )
  //       }
  //   `;

  const characterLimits = {
    model: {
      vendor: 30,
      modelNumber: 40,
      shortDescription: 100,
      comment: 2000,
      calibrationFrequency: 10,
    },
  };
  //     instrument: {
  //       vendor: 30,
  //       modelNumber: 40,
  //       serialNumber: 40,
  //       comment: 200,
  //       calibrationUsername: 50,
  //       calibrationDate: 20,
  //       calibrationComment: 200,
  //     },
  //   };

  // Create a reference to the hidden file input element

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => camelCase(header),
  };

  const requiredHeaders = ['vendor', 'modelNumber', 'shortDescription'];

  const checkAllKeys = (data, keys) => keys.every((item) => Object.prototype.hasOwnProperty.call(data, item) && data[item]);

  const validateKeys = (data) => {
    // Check all headers in data:
    const missingKeys = [];
    data.forEach((item, index) => {
      console.log(item);
      if (!checkAllKeys(item, requiredHeaders)) {
        missingKeys.push(index);
      }
    });
    return missingKeys;
  };

  const checkDuplicateModels = (data) => {
    const duplicateModels = [];
    const modelMap = new Map();

    // TODO: add index to forEach for better error handling
    data.forEach((item) => {
      const itemVendor = item.vendor;
      const itemModelNumber = item.modelNumber;

      // Check if map contains vendor
      if (modelMap.has(itemVendor)) {
        const vendorModels = modelMap.get(itemVendor);
        if (vendorModels.indexOf(itemModelNumber) !== -1) {
          duplicateModels.push({
            vendor: itemVendor,
            modelNumber: itemModelNumber,
          });
        }
      } else {
        modelMap.set(itemVendor, new Array(itemModelNumber));
      }
    });
    return duplicateModels;
  };

  const validateRow = (row) => {
    // TODO: Make this less ugly
    const invalidKeys = [];
    if (row.vendor.length > characterLimits.model.vendor) {
      invalidKeys.push('Vendor');
    }
    if (row.modelNumber.length > characterLimits.model.modelNumber) {
      invalidKeys.push('Model-Number');
    }
    if (row.shortDescription.length > characterLimits.model.shortDescription) {
      invalidKeys.push('Short-Description');
    }
    if (row.comment.length > characterLimits.model.comment) {
      invalidKeys.push('Comment');
    }
    if (row.calibrationFrequency.length > characterLimits.model.calibrationFrequency) {
      invalidKeys.push('Calibration-Frequency');
    }
    return invalidKeys;
  };

  const validateAllFields = (data) => {
    const allInvalidFields = [];
    data.forEach((item, index) => {
      const invalidKeys = validateRow(item);
      if (invalidKeys.length > 0) {
        allInvalidFields.push({
          row: index + 1,
          invalidKeys,
        });
      }
    });
    return allInvalidFields;
  };

  const handleCSVReader = (data /* , fileInfo */) => {
    // TODO: Refactor, single loop over all data values, give errors row by row (instead of by concept)
    // TODO: Handle (NA) in calibrationFrequency (filter this to null value?)
    // Validate headers
    const missingKeys = validateKeys(data);
    if (missingKeys.length) {
      console.log(`ERROR: Missing keys in rows: ${missingKeys}`);
      setShow(true);
      return;
    }

    // Check for duplicate vendor/model number in sheet
    const duplicateModels = checkDuplicateModels(data);
    if (duplicateModels.length) {
      console.log('ERROR: Duplicate models: ');
      console.log(duplicateModels);
    }

    // Check character limits by field
    // TODO: Specific character validation
    const allInvalidFields = validateAllFields(data);
    if (allInvalidFields.length) {
      console.log('ERROR: Invalid field lengths: ');
      console.log(allInvalidFields);
    }

    // Now all fields have been validated, time to attempt a db push...
    const query = print(IMPORT_MODELS);
    const queryName = 'bulkImportData';

    const getVariables = () => ({
      data,
    });
    const handleResponse = (response) => {
      console.log('Query Response:');
      console.log(response);
    };
    console.log('Sending query for bulk import...');
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
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
