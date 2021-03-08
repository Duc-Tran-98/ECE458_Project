import React from 'react';
import { camelCase } from 'lodash';
import CustomUpload from './CustomUpload';

export default function ImpModels() {
  const handleImport = (fileInfo) => {
    console.log(fileInfo);
  };

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
        return value.split(/\s+/);
      default:
        return value.trim();
    }
  };

  const uploadLabel = 'Select Models File';

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
