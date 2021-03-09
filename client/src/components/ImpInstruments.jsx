import React, { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import moment from 'moment';
import Query from './UseQuery';
import CustomUpload from './CustomUpload';
import ModalAlert from './ModalAlert';
import ImportInstrumentError from './ImportInstrumentError';
import DisplayGrid from './UITable';
import UserContext from './UserContext';

export default function ImpInstruments() {
  const user = useContext(UserContext);
  const [rows, setRow] = React.useState([]);
  const [showTable, setShowTable] = React.useState(false);
  const [importStatus, setImportStatus] = React.useState('Import');
  const [show, setShow] = React.useState(false);
  const [allRowErrors, setAllRowErrors] = React.useState([]);
  const closeModal = () => {
    setShow(false);
    setAllRowErrors([]);
  };

  const requiredHeaders = [
    { display: 'Vendor', value: 'vendor' },
    { display: 'Model-Number', value: 'modelNumber' },
    { display: 'Serial-Number', value: 'serialNumber' },
    { display: 'Asset-Tag-Number', value: 'assetTag' },
    { display: 'Comment', value: 'comment' },
    { display: 'Calibration-Date', value: 'calibrationDate' },
    { display: 'Calibration-Comment', value: 'calibrationComment' },
    { display: 'Instrument-Categories', value: 'categories' },
  ];
  const customHeaderTransform = (header) => {
    switch (header) {
      case 'Short-Description':
        return 'description';
      case 'Instrument-Categories':
        return 'categories';
      case 'Asset-Tag-Number':
        return 'assetTag';
      default:
        return camelCase(header);
    }
  };
  // TODO: Remove transform here, perform after error handling
  // TODO: Submit variance request to allow these (load bank likely, calib unlikely)
  const customTransform = (value, header) => {
    if (value == null) return null;
    switch (header) {
      case 'categories':
        // eslint-disable-next-line no-case-declarations
        const arr = value.trim().split(/\s+/);
        if (arr.length > 0 && arr[0] !== '') { return arr; }
        return null;
      default:
        return value.trim().length > 0 ? value.trim() : null;
    }
  };
  const uploadLabel = 'Select Instruments File';

  const IMPORT_INSTRUMENTS = gql`
    mutation ImportInstruments (
      $instruments: [InstrumentInput]
    ) {
      bulkImportInstruments(instruments: $instruments)
    }
    `;
  const query = print(IMPORT_INSTRUMENTS);
  const queryName = 'bulkImportInstruments';
  const renderTable = (instruments) => {
    const filteredData = instruments.map((obj) => ({
      id: String(obj.vendor + obj.modelNumber),
      ...obj,
    }));
    setRow(filteredData);
    setShowTable(true);
    console.log(filteredData);
  };

  const characterLimits = {
    instrument: {
      vendor: 30,
      modelNumber: 40,
      serialNumber: 40,
      comment: 2000,
      categories: 100,
      calibrationDate: 20,
      calibrationComment: 2000,
    },
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
    { field: 'vendor', headerName: 'Vendor', width: 120 },
    { field: 'modelNumber', headerName: 'Model-Number', width: 150 },
    { field: 'serialNumber', headerName: 'Serial-Number', width: 150 },
    { field: 'assetTag', headerName: 'Asset-Tag', width: 150 },
    {
      field: 'comment',
      headerName: 'Comment',
      width: 300,
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    },
    { field: 'calibrationDate', headerName: 'Calib-Date', width: 150 },
    {
      field: 'calibrationComment',
      headerName: 'Calibration Comment',
      width: 300,
      hide: true,
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    },

  ];

  const getMissingKeys = (row) => {
    const missingKeys = [];
    if (!row.vendor) missingKeys.push('Vendor');
    if (!row.modelNumber) missingKeys.push('Model-Number');
    if (!row.serialNumber) missingKeys.push('Serial-Number');
    return missingKeys.length > 0 ? missingKeys : null;
  };

  const checkDuplicateInstrument = (data, vendor, modelNumber, serialNumber, myIndex) => {
    let isDuplicateInstrument = false;
    data.forEach((row, index) => {
      if (index !== myIndex && row.vendor === vendor && row.modelNumber === modelNumber && row.serialNumber === serialNumber) {
        isDuplicateInstrument = true;
      }
    });
    return isDuplicateInstrument;
  };

  const validateRow = (row) => {
    const invalidKeys = [];
    if (row.vendor && row.vendor.length > characterLimits.instrument.vendor) { invalidKeys.push('Vendor'); }
    if (row.modelNumber && row.modelNumber.length > characterLimits.instrument.modelNumber) { invalidKeys.push('Model-Number'); }
    if (row.serialNumber && row.serialNumber.length > characterLimits.instrument.serialNumber) { invalidKeys.push('Serial-Number'); }
    if (row.comment && row.comment.length > characterLimits.instrument.comment) { invalidKeys.push('Comment'); }
    if (row.categories && row.categories.length > characterLimits.instrument.categories) { invalidKeys.push('Instrument-Categories'); }
    if (row.calibrationDate && row.calibrationDate.length > characterLimits.instrument.calibrationDate) { invalidKeys.push('Calibration-Date'); }
    if (row.calibrationComment && row.calibrationComment.length > characterLimits.instrument.calibrationComment) { invalidKeys.push('Calibration-Comment'); }
    return invalidKeys.length > 0 ? invalidKeys : null;
  };

  const emptyLine = (obj) => !Object.values(obj).every((x) => x == null);

  const getImportErrors = (fileInfo) => {
    const importRowErrors = [];
    fileInfo.forEach((row, index) => {
      if (!emptyLine(row)) {
        // Check missing keys
        const missingKeys = getMissingKeys(row);

        let isDuplicateInstrument;
        if (row.vendor && row.modelNumber && row.serialNumber) {
          isDuplicateInstrument = checkDuplicateInstrument(fileInfo, row.vendor, row.modelNumber, row.serialNumber, index);
        }

        // Validate entries by length
        const invalidEntries = validateRow(row);

        // Validate calibration date (missing, form, future)

        // If any errors exist, create errors object
        if (missingKeys || invalidEntries || isDuplicateInstrument) {
          const rowError = {
            data: row,
            row: index + 2,
            ...(missingKeys) && { missingKeys },
            ...(invalidEntries) && { invalidEntries },
            ...(isDuplicateInstrument) && { isDuplicateInstrument },
          };
          importRowErrors.push(rowError);
        }
      }
    });
    return importRowErrors.length > 0 ? importRowErrors : null;
  };

  const validateFile = (fileInfo) => {
    const importRowErrors = getImportErrors(fileInfo);
    if (importRowErrors) {
      console.log('Errors in file validation: ');
      console.log(importRowErrors);
      setAllRowErrors(importRowErrors);
      setShow(true);
      return false;
    }
    return true;
  };

  // TODO: Implement trim with transform
  // const trimEmptyLines = (fileInfo) => fileInfo.filter((row) => {
  //   console.log(row);
  //   console.log(`is empty?: ${!emptyLine(row)}`);
  //   return !emptyLine(row);
  // });

  // TODO: Validate asset tag is parseable as integer (in validation)
  const filterData = (fileInfo) => fileInfo.map((obj) => ({
    ...obj,
    vendor: String(obj.vendor),
    modelNumber: String(obj.modelNumber),
    ...(obj.assetTag) && { assetTag: parseInt(obj.assetTag, 10) },
    ...(obj.serialNumber) && { serialNumber: String(obj.serialNumber) },
    ...(obj.calibrationDate) && { calibrationUser: user.userName },
    ...(obj.calibrationDate) && { calibrationDate: moment(obj.calibrationDate, 'MM/DD/YYYY').format('YYYY-MM-DD') },
    ...(obj.calibrationDate && obj.calibrationComment) && { calibrationComment: obj.calibrationComment },
  }));

  const handleImport = (fileInfo, resetUpload) => {
    console.log('Handling import with fileInfo: ');
    console.log('fileinfo');
    console.log(fileInfo);
    // const models = trimEmptyLines(fileInfo);
    const instruments = filterData(fileInfo);
    console.log('filtered data into instruments: ');
    console.log(instruments);
    console.log(instruments);
    instruments.forEach((el) => {
      if (el.assetTag !== null && typeof el.assetTag !== 'number') console.log(el.assetTag);
      if (typeof el.vendor !== 'string') console.log(el.vendor);
      if (typeof el.modelNumber !== 'string') console.log(el.modelNumber);
    });
    setImportStatus('Validating');
    if (!validateFile(instruments)) {
      setImportStatus('Import');
      return;
    }

    // File has been validated, now push to database
    const getVariables = () => ({ instruments });
    Query({
      query,
      queryName,
      getVariables,
      handleResponse: (response) => {
        console.log(response);
        if (response.success) {
          toast.success(`Successfully imported ${instruments.length} instruments!`);
          renderTable(instruments);
          resetUpload();
        } else {
          toast.error(response.message);
        }
        setImportStatus('Import');
      },
      handleError: () => {
        toast.error('Please try again');
        resetUpload();
      },
    });
  };

  return (
    <>
      <ToastContainer />
      <CustomUpload
        requiredHeaders={requiredHeaders}
        customHeaderTransform={customHeaderTransform}
        customTransform={customTransform}
        uploadLabel={uploadLabel}
        handleImport={handleImport}
        importStatus={importStatus}
      />
      <ModalAlert handleClose={closeModal} show={show} title="Error Importing Instruments" width=" ">
        <ImportInstrumentError allRowErrors={allRowErrors} errorList={[]} />
      </ModalAlert>
      {showTable && <DisplayGrid rows={rows} cols={cols} />}
    </>
  );
}
