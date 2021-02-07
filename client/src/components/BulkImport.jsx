import React from 'react';
import { Button } from 'react-bootstrap';
import XLSX from 'xlsx';
import CSVFileValidator from 'csv-file-validator';

export default function BulkImport() {
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
  const requiredError = (headerName, rowNumber, columnNumber) => `<div class="red">${headerName} is required in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`;

  const modelConfig = {
    headers: [
      {
        name: 'Vendor',
        inputName: 'vendor',
        required: true,
        requiredError,
      },
      {
        name: 'Model Number',
        inputName: 'modelNumber',
        required: true,
        requiredError,
      },
      {
        name: 'Short Description',
        inputName: 'shortDescription',
        required: true,
        requiredError,
      },
      {
        name: 'Calibration Frequency',
        inputName: 'calibrationFrequency',
        required: true,
        requiredError,
      },
    ],
  };

  const parseModels = (worksheet) => {
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

  const parseInstruments = (worksheet) => {
    console.log(XLSX.utils.sheet_to_row_object_array(worksheet));
  };

  const parseCalibration = (worksheet) => {
    console.log(XLSX.utils.sheet_to_row_object_array(worksheet));
  };

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
      parseInstruments(readData.Sheets.Instruments);
      parseCalibration(readData.Sheets.Calibration);
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
