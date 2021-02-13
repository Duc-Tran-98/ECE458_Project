import React from 'react';
import { Button } from 'react-bootstrap';
import XLSX from 'xlsx';
// import CSVFileValidator from 'csv-file-validator';
const CSVFileValidator = require('csv-file-validator');

export default function BulkImport() {
  const characterLimits = {
    model: {
      vendor: 30,
      modelNumber: 40,
      shortDescription: 100,
      comment: 200,
      calibrationFrequency: 10,
    },
    instrument: {
      vendor: 30,
      modelNumber: 40,
      serialNumber: 40,
      comment: 200,
    },
    calibration: {
      vendor: 30,
      modelNumber: 40,
      serialNumber: 40,
      calibrationUsername: 50,
      calibrationDate: 20,
      calibrationComment: 200,
    },
  };

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // TODO - refactor into pretty UI error
  const requiredError = (headerName, rowNumber, columnNumber) => `REQUIRED: ${headerName} (${rowNumber}, ${columnNumber})`;
  const validateError = (headerName, rowNumber, columnNumber) => `INVALID: ${headerName} (${rowNumber}, ${columnNumber})`;

  const validateASCII = (field, length) => {
    const validLength = field.length <= length;
    return validLength;
  };

  const modelConfig = {
    headers: [
      {
        name: 'Vendor',
        inputName: 'vendor',
        required: true,
        requiredError,
        validate(vendor) {
          return validateASCII(vendor, characterLimits.model.vendor);
        },
        validateError,
      },
      {
        name: 'Model Number',
        inputName: 'modelNumber',
        required: true,
        requiredError,
        validate(modelNumber) {
          return validateASCII(modelNumber, characterLimits.model.modelNumber);
        },
        validateError,
      },
      {
        name: 'Short Description',
        inputName: 'shortDescription',
        required: true,
        requiredError,
        validate(shortDescription) {
          return validateASCII(shortDescription, characterLimits.model.shortDescription);
        },
        validateError,
      },
      {
        name: 'Comment',
        inputName: 'comment',
        required: false,
        // requiredError,
        validate(comment) {
          return validateASCII(comment, characterLimits.model.comment);
        },
        validateError,
      },
      {
        name: 'Calibration Frequency',
        inputName: 'calibrationFrequency',
        required: true,
        requiredError,
        validate(calibrationFrequency) {
          return validateASCII(calibrationFrequency, characterLimits.model.calibrationFrequency);
        },
        validateError,
      },
    ],
  };

  const instrumentConfig = {
    headers: [
      {
        name: 'Vendor',
        inputName: 'vendor',
        required: true,
        requiredError,
        validate(vendor) {
          return validateASCII(vendor, characterLimits.instrument.vendor);
        },
        validateError,
      },
      {
        name: 'Model Number',
        inputName: 'modelNumber',
        required: true,
        requiredError,
        validate(modelNumber) {
          return validateASCII(modelNumber, characterLimits.instrument.modelNumber);
        },
        validateError,
      },
      {
        name: 'Serial Number',
        inputName: 'serialNumber',
        required: true,
        requiredError,
        validate(serialNumber) {
          return validateASCII(serialNumber, characterLimits.instrument.shortDescription);
        },
        validateError,
      },
      {
        name: 'Comment',
        inputName: 'comment',
        required: false,
        // requiredError,
        validate(comment) {
          return validateASCII(comment, characterLimits.instrument.comment);
        },
        validateError,
      },
    ],
  };

  const calibrationConfig = {
    headers: [
      {
        name: 'Vendor',
        inputName: 'vendor',
        required: true,
        requiredError,
        validate(vendor) {
          return validateASCII(vendor, characterLimits.calibration.vendor);
        },
        validateError,
      },
      {
        name: 'Model Number',
        inputName: 'modelNumber',
        required: true,
        requiredError,
        validate(modelNumber) {
          return validateASCII(modelNumber, characterLimits.calibration.modelNumber);
        },
        validateError,
      },
      {
        name: 'Serial Number',
        inputName: 'serialNumber',
        required: true,
        requiredError,
        validate(serialNumber) {
          return validateASCII(serialNumber, characterLimits.calibration.serialNumber);
        },
        validateError,
      },
      {
        name: 'Calibration Username',
        inputName: 'calibrationUsername',
        required: true,
        requiredError,
        validate(calibrationUsername) {
          return validateASCII(calibrationUsername, characterLimits.calibration.calibrationUsername);
        },
        validateError,
      },
      {
        name: 'Calibration Date',
        inputName: 'calibrationDate',
        required: true,
        requiredError,
        validate(calibrationDate) {
          return validateASCII(calibrationDate, characterLimits.calibration.calibrationDate);
        },
        validateError,
      },
      {
        name: 'Calibration Comment',
        inputName: 'calibrationComment',
        required: false,
        // requiredError,
        validate(calibrationComment) {
          return validateASCII(calibrationComment, characterLimits.calibration.calibrationComment);
        },
        validateError,
      },
    ],
  };

  const validateWorksheet = (worksheet, config, sheetName) => {
    console.log(`Validating ${sheetName}`);

    console.log(XLSX.utils.sheet_to_row_object_array(worksheet));
    const csvFile = XLSX.utils.sheet_to_csv(worksheet);

    return CSVFileValidator(csvFile, config)
      .then((csvData) => csvData.invalidMessages)
      .catch((err) => {
        // TODO - handle error in overall file validation
        console.log(err);
      });
  };

  // const handleSheetValidationErrors(validationErrors, sheetName)

  const handleValidationErrors = (validationErrors) => {
    console.log('Handling valiation errors');
    console.log(validationErrors);

    validationErrors.models
      .then((result) => {
        console.log(result);
      });
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleUpload = (e) => {
    e.preventDefault();
    const validationErrors = {
      models: [],
      instruments: [],
      calibration: [],
    };

    const { files } = e.target;
    const f = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const readData = XLSX.read(data, { type: 'binary' });

      const sheetNames = readData.SheetNames;
      console.log(sheetNames);
      console.log(readData.Sheets);

      // Validate sheet names are correct

      // Parse each worksheet by its sheet names
      validationErrors.models = validateWorksheet(readData.Sheets.Models, modelConfig, 'Models');
      validationErrors.instruments = validateWorksheet(readData.Sheets.Instruments, instrumentConfig, 'Instruments');
      validationErrors.calibration = validateWorksheet(readData.Sheets.Calibration, calibrationConfig, 'Calibration');

      handleValidationErrors(validationErrors);
    };

    reader.readAsBinaryString(f);

    // Handle any error messages
  };

  return (
    <>
      <Button variant="primary" className="m-2" onClick={handleClick}>
        Import
      </Button>
      <input
        type="file"
        accept=".xlsx"
        ref={hiddenFileInput}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </>
  );
}
