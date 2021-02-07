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
  };

  // const fileData = {
  //   models: [],
  //   instruments: [],
  //   calibration: [],
  // };

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // TODO - refactor into pretty UI error
  const requiredError = (headerName, rowNumber, columnNumber) => {
    // const message = `<div class="red">${headerName} is required in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`;
    const message = `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
    return message;
  };

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
      },
      {
        name: 'Model Number',
        inputName: 'modelNumber',
        required: true,
        requiredError,
        validate(modelNumber) {
          return validateASCII(modelNumber, characterLimits.model.modelNumber);
        },
      },
      {
        name: 'Short Description',
        inputName: 'shortDescription',
        required: true,
        requiredError,
        validate(shortDescription) {
          return validateASCII(shortDescription, characterLimits.model.shortDescription);
        },
      },
      {
        name: 'Comment',
        inputName: 'comment',
        required: true,
        requiredError,

        validate(comment) {
          return validateASCII(comment, characterLimits.model.comment);
        },
      },
      {
        name: 'Calibration Frequency',
        inputName: 'calibrationFrequency',
        required: true,
        requiredError,
        validate(calibrationFrequency) {
          return validateASCII(calibrationFrequency, characterLimits.model.calibrationFrequency);
        },
      },
    ],
  };

  const parseModels = (worksheet) => {
    console.log('Parsing models worksheet');

    console.log(XLSX.utils.sheet_to_row_object_array(worksheet));
    const modelCSV = XLSX.utils.sheet_to_csv(worksheet);

    CSVFileValidator(modelCSV, modelConfig)
      .then((csvData) => {
        console.log(csvData.inValidMessages);
        console.log(csvData.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const parseInstruments = (worksheet) => {
  //   console.log(XLSX.utils.sheet_to_row_object_array(worksheet));
  // };

  // const parseCalibration = (worksheet) => {
  //   console.log(XLSX.utils.sheet_to_row_object_array(worksheet));
  // };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleUpload = (e) => {
    e.preventDefault();

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
      parseModels(readData.Sheets.Models);
      // parseInstruments(readData.Sheets.Instruments);
      // parseCalibration(readData.Sheets.Calibration);
    };
    reader.readAsBinaryString(f);
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
