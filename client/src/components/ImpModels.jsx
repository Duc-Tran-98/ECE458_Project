import React from 'react';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from './UseQuery';
import CustomUpload from './CustomUpload';

export default function ImpModels() {
  const requiredHeaders = [
    { display: 'Vendor', value: 'vendor' },
    { display: 'Model-Number', value: 'modelNumber' },
    { display: 'Short-Description', value: 'description' },
    { display: 'Comment', value: 'comment' },
    { display: 'Model-Categories', value: 'categories' },
    { display: 'Load-Bank-Support', value: 'loadBankSupport' },
    { display: 'Calibration-Frequency', value: 'calibrationFrequency' },
  ];

  const customHeaderTransform = (header) => {
    switch (header) {
      case 'Short-Description':
        return 'description';
      case 'Model-Categories':
        return 'categories';
      default:
        return camelCase(header);
    }
  };

  const customTransform = (value, header) => {
    switch (header) {
      case 'categories':
        // eslint-disable-next-line no-case-declarations
        const arr = value.trim().split(/\s+/);
        if (arr.length > 0 && arr[0] !== '') { return arr; }
        return null;
      case 'calibrationFrequency':
        return Number.isNaN(value) ? null : parseInt(value, 10);
      case 'loadBankSupport':
        return value === 'Y' || value === 'y';
      default:
        return value.trim();
    }
  };

  const uploadLabel = 'Select Models File';

  const IMPORT_MODELS = gql`
    mutation ImportModels (
      $models: [ModelInput]!
    ) {
      bulkImportModels(models: $models)
    }
  `;
  const query = print(IMPORT_MODELS);
  const queryName = 'bulkImportModels';

  // TODO: Implement me!
  const filterData = (fileInfo) => fileInfo;

  const handleImport = (fileInfo) => {
    console.log('Handling import');
    const models = filterData(fileInfo);
    const getVariables = () => ({ models });
    console.log(fileInfo);
    Query({
      query,
      queryName,
      getVariables,
      // TODO: Handle response correctly (see ImportModels, add table if success)
      handleResponse: (response) => {
        console.log(response);
      },
    });
  };

  return (
    <>
      <CustomUpload
        requiredHeaders={requiredHeaders}
        customHeaderTransform={customHeaderTransform}
        customTransform={customTransform}
        uploadLabel={uploadLabel}
        handleImport={handleImport}
      />
    </>
  );
}
