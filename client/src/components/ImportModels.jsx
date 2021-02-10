import React from 'react';
import CSVReader from 'react-csv-reader';

export default function ImportModels() {
//   const characterLimits = {
//     model: {
//       vendor: 30,
//       modelNumber: 40,
//       shortDescription: 100,
//       comment: 200,
//       calibrationFrequency: 10,
//     },
//     instrument: {
//       vendor: 30,
//       modelNumber: 40,
//       serialNumber: 40,
//       comment: 200,
//     },
//     calibration: {
//       vendor: 30,
//       modelNumber: 40,
//       serialNumber: 40,
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
    transformHeader: (header) => header
      .toLowerCase(),
  };

  // const modelHeaders = {
  //   vendor: 'vendor',
  //   modelNumber: 'model-number',
  //   shortDescription: 'short-description',
  //   comment: 'comment',
  //   calibrationFrequency: 'calibration-frequency',
  // };

  // const extractColumns = (data) => data.map((element) => ({
  //   vendor: element[modelHeaders.vendor],
  //   modelNumber: element[modelHeaders.modelNumber],
  //   shortDescription: element[modelHeaders.shortDescription],
  //   comment: element[modelHeaders.comment],
  //   calibrationFrequency: element[modelHeaders.calibrationFrequency],
  // }));

  const requiredHeaders = ['vendor', 'model-number', 'short-description'];

  const checkAllKeys = (data, keys) => keys.every((item) => Object.prototype.hasOwnProperty.call(data, item) && data[item]);

  // TODO - validate all fields have header
  const validateKeys = (data) => {
    // Check all headers in data:
    const missingKeys = [];
    data.forEach((item, index) => {
      if (!checkAllKeys(item, requiredHeaders)) {
        missingKeys.push(index);
      }
    });
    return missingKeys;
  };

  const handleCSVReader = (data, fileInfo) => {
    // Validate headers
    const missingKeys = validateKeys(data);
    if (missingKeys) {
      console.log(`ERROR: Missing keys in rows: ${missingKeys}`);
      return;
    }

    // Extract appropriate columns
    // const parsedData = extractColumns(data);
    // console.log(parsedData);

    console.log(data);
    console.log(fileInfo);
  };

  return (
    <>

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
