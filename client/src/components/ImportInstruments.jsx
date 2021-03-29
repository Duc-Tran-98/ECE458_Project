import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import moment from 'moment';
import Query from './UseQuery';
import CustomUpload from './CustomUpload';
import { StateLessModal } from './ModalAlert';
import ImportInstrumentError from './ImportInstrumentError';
import DisplayGrid from './UITable';
import UserContext from './UserContext';

export default function ImportInstruments() {
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

  const resetState = () => {
    setImportStatus('Import');
    // setShowTable(false);
  };

  const hideTable = () => {
    setShowTable(false);
  };

  const requiredHeaders = [
    { display: 'Vendor', value: 'vendor' },
    { display: 'Model-Number', value: 'modelNumber' },
    { display: 'Serial-Number', value: 'serialNumber' },
    { display: 'Asset-Tag-Number', value: 'assetTag' },
    { display: 'Comment', value: 'comment' },
    { display: 'Calibration-Date', value: 'calibrationDate' },
    { display: 'Calibration-Comment', value: 'calibrationComment' },
    { display: 'Instrument-Categories', value: 'instrumentCategories' },
  ];
  const customHeaderTransform = (header) => {
    switch (header) {
      case 'Short-Description':
        return 'description';
      case 'Asset-Tag-Number':
        return 'assetTag';
      default:
        return camelCase(header);
    }
  };
  const customTransform = (value, header) => {
    if (value == null) return null;
    switch (header) {
      case 'instrumentCategories':
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
  const query = IMPORT_INSTRUMENTS;
  const queryName = 'bulkImportInstruments';
  const renderTable = (instruments) => {
    const filteredData = instruments.map((obj) => ({
      id: Math.random(),
      ...obj,
    }));
    setRow(filteredData);
    setShowTable(true);
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
      headerName: 'Calib-Comment',
      width: 300,
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
    return missingKeys.length > 0 ? missingKeys : null;
  };

  const checkDuplicateAssetTag = (data, assetTag, myIndex) => {
    if (!assetTag) { return false; }
    let isDuplicate = false;
    data.forEach((row, index) => {
      if (index !== myIndex && row.assetTag === assetTag) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  };
  const checkDuplicateInstrument = (data, vendor, modelNumber, serialNumber, myIndex) => {
    if (!vendor || !modelNumber || !serialNumber) { return false; }
    let isDuplicateInstrument = false;
    data.forEach((row, index) => {
      if (index !== myIndex && row.vendor === vendor && row.modelNumber === modelNumber && row.serialNumber === serialNumber) {
        isDuplicateInstrument = true;
      }
    });
    return isDuplicateInstrument;
  };
  const validateCalibrationDate = (calibrationDate) => {
    const today = moment();
    return moment(calibrationDate).isAfter(today);
  };
  const validAssetTag = (assetTag) => {
    if (assetTag) {
      const assetInt = parseInt(assetTag, 10);
      return assetInt >= 100000 && assetInt <= 999999;
    }
    return true; // blank asset tag is okay too
  };

  const validateRow = (row) => {
    const invalidKeys = [];
    if (row.vendor && row.vendor.length > characterLimits.instrument.vendor) { invalidKeys.push('Vendor'); }
    if (row.modelNumber && row.modelNumber.length > characterLimits.instrument.modelNumber) { invalidKeys.push('Model-Number'); }
    if (row.serialNumber && row.serialNumber.length > characterLimits.instrument.serialNumber) { invalidKeys.push('Serial-Number'); }
    if (row.comment && row.comment.length > characterLimits.instrument.comment) { invalidKeys.push('Comment'); }
    if (row.instrumentCategories && row.instrumentCategories.length > characterLimits.instrument.categories) { invalidKeys.push('Instrument-Categories'); }
    if (row.calibrationDate && row.calibrationDate.length > characterLimits.instrument.calibrationDate) { invalidKeys.push('Calibration-Date'); }
    if (row.calibrationComment && row.calibrationComment.length > characterLimits.instrument.calibrationComment) { invalidKeys.push('Calibration-Comment'); }
    return invalidKeys.length > 0 ? invalidKeys : null;
  };

  // const emptyLine = (obj) => !Object.values(obj).every((x) => x == null);

  const getImportErrors = (fileInfo) => {
    const importRowErrors = [];
    fileInfo.forEach((row, index) => {
      const missingKeys = getMissingKeys(row);
      const isDuplicateInstrument = checkDuplicateInstrument(fileInfo, row.vendor, row.modelNumber, row.serialNumber, index);
      const invalidEntries = validateRow(row);
      const isDuplicateAssetTag = checkDuplicateAssetTag(fileInfo, row.assetTag, index);
      const invalidCalibrationDate = validateCalibrationDate(row.calibrationDate);
      const invalidAssetTag = !validAssetTag(row.assetTag);

      // If any errors exist, create errors object
      if (missingKeys || invalidEntries || isDuplicateInstrument || isDuplicateAssetTag || invalidCalibrationDate || invalidAssetTag) {
        const rowError = {
          data: row,
          row: index + 2,
          ...(missingKeys) && { missingKeys },
          ...(invalidEntries) && { invalidEntries },
          ...(isDuplicateInstrument) && { isDuplicateInstrument },
          ...(isDuplicateAssetTag && !invalidAssetTag) && { isDuplicateAssetTag },
          ...(invalidCalibrationDate) && { invalidCalibrationDate },
          ...(invalidAssetTag) && { invalidAssetTag },
        };
        importRowErrors.push(rowError);
      }
    });
    return importRowErrors.length > 0 ? importRowErrors : null;
  };

  const validateFile = (fileInfo) => {
    const importRowErrors = getImportErrors(fileInfo);
    if (importRowErrors) {
      setAllRowErrors(importRowErrors);
      setShow(true);
      return false;
    }
    return true;
  };

  const filterData = (fileInfo) => fileInfo.map((obj) => ({
    vendor: String(obj.vendor),
    modelNumber: String(obj.modelNumber),
    categories: obj.instrumentCategories,
    serialNumber: obj.serialNumber,
    comment: obj.comment ? String(obj.comment) : null,
    assetTag: obj.assetTag ? parseInt(obj.assetTag, 10) : null,
    calibrationDate: obj.calibrationDate ? moment(obj.calibrationDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
    calibrationUser: obj.calibrationDate ? user.userName : null,
    calibrationComment: obj.calibrationDate && obj.calibrationComment ? String(obj.calibrationComment) : null,
  }));

  const handleImport = (fileInfo, resetUpload) => {
    const instruments = filterData(fileInfo);
    setImportStatus('Validating');
    if (!validateFile(instruments)) {
      resetState();
      return;
    }

    // File has been validated, now push to database
    const refetch = JSON.parse(window.sessionStorage.getItem('getInstrumentsWithFilter'))
      || null;
    const refetchQueries = refetch !== null
      ? [
        {
          query: refetch.query,
          variables: refetch.variables,
        },
      ]
      : [];
    const getVariables = () => ({ instruments });
    Query({
      query,
      queryName,
      refetchQueries,
      getVariables,
      handleResponse: (response) => {
        if (response.success) {
          toast.success(`Successfully imported ${instruments.length} instruments!`);
          renderTable(instruments);
          resetUpload();
        } else {
          toast.error(response.message);
        }
        resetState();
      },
      handleError: () => {
        toast.error('Sorry, process took longer than expected. Please check back in a few minutes.');
        resetState();
        resetUpload();
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
        importStatus={importStatus}
        hideTable={hideTable}
      />
      <StateLessModal handleClose={closeModal} show={show} title="Error Importing Instruments" width=" ">
        <ImportInstrumentError allRowErrors={allRowErrors} errorList={[]} />
      </StateLessModal>
      {showTable && <DisplayGrid rows={rows} cols={cols} />}
    </>
  );
}
