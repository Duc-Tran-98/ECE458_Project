import React from 'react';
import { toast } from 'react-toastify';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from './UseQuery';
import CustomUpload from './CustomUpload';
import ModalAlert from './ModalAlert';
import ImportModelError from './ImportModelError';
import DisplayGrid from './UITable';

export default function ImpModels() {
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
  // TODO: Remove transform here, perform after error handling
  // TODO: Submit variance request to allow these (load bank likely, calib unlikely)
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
        return typeof (value) === 'string' && (value.toLowerCase() === 'y' || value.toLowerCase() === 'yes');
      default:
        return value.trim().length > 0 ? value.trim() : null;
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
  const renderTable = (models) => {
    const filteredData = models.map((obj) => ({
      id: String(obj.vendor + obj.modelNumber),
      vendor: String(obj.vendor),
      modelNumber: String(obj.modelNumber),
      description: String(obj.description),
      ...(obj.comment) && { comment: String(obj.comment) },
      ...(obj.calibrationFrequency !== 'N/A') && { calibrationFrequency: parseInt(obj.calibrationFrequency, 10) },
    }));
    setRow(filteredData);
    setShowTable(true);
    console.log(filteredData);
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
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model-Number', width: 150 },
    { field: 'description', headerName: 'Short-Description', width: 240 },
    {
      field: 'comment',
      headerName: 'Comment',
      width: 300,
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    }, { field: 'calibrationFrequency', headerName: 'Calibration-Frequency', width: 200 },
  ];

  const characterLimits = {
    model: {
      vendor: 30,
      modelNumber: 40,
      description: 100,
      categories: 100,
      comment: 2000,
      calibrationFrequency: 10,
    },
  };

  const getMissingKeys = (row) => {
    const missingKeys = [];
    if (!row.vendor) missingKeys.push('Vendor');
    if (!row.modelNumber) missingKeys.push('Model-Number');
    if (!row.description) missingKeys.push('Short-Description');
    return missingKeys.length > 0 ? missingKeys : null;
  };

  const checkDuplicateModel = (data, vendor, modelNumber, myIndex) => {
    if (!vendor || !modelNumber) { return false; }
    let isDuplicateModel = false;
    data.forEach((row, index) => {
      if (index !== myIndex && row.vendor === vendor && row.modelNumber === modelNumber) {
        isDuplicateModel = true;
      }
    });
    return isDuplicateModel;
  };

  const validateRow = (row) => {
    const invalidKeys = [];
    if (row.vendor && row.vendor.length > characterLimits.model.vendor) { invalidKeys.push('Vendor'); }
    if (row.modelNumber && row.modelNumber.length > characterLimits.model.modelNumber) { invalidKeys.push('Model-Number'); }
    if (row.description && row.description.length > characterLimits.model.description) { invalidKeys.push('Short-Description'); }
    if (row.categories && row.categories.length > characterLimits.model.categories) { invalidKeys.push('Model-Categories'); }
    if (row.comment && row.comment.length > characterLimits.model.comment) { invalidKeys.push('Comment'); }
    if (row.calibrationFrequency && row.calibrationFrequency.length > characterLimits.model.calibrationFrequency) { invalidKeys.push('Calibration-Frequency'); }
    return invalidKeys.length > 0 ? invalidKeys : null;
  };

  const validateCalibrationFrequency = (calibrationFrequency) => {
    if (calibrationFrequency) { return calibrationFrequency > 0; }
    return true;
  };

  const emptyLine = (obj) => !Object.values(obj).every((x) => x == null);

  const getImportErrors = (fileInfo) => {
    const importRowErrors = [];
    fileInfo.forEach((row, index) => {
      console.log(row);
      console.log(`emptyLine: ${emptyLine(row)}`);
      if (!emptyLine(row)) {
        const missingKeys = getMissingKeys(row);
        const isDuplicateModel = checkDuplicateModel(fileInfo, row.vendor, row.modelNumber, index);
        const invalidEntries = validateRow(row);
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

  const handleImport = (fileInfo, resetUpload) => {
    console.log('Handling import with fileInfo: ');
    console.log(fileInfo);
    // const models = trimEmptyLines(fileInfo);
    const models = fileInfo;
    console.log(models);
    setImportStatus('Validating');
    if (!validateFile(models)) {
      setImportStatus('Import');
      return;
    }

    // File has been validated, now push to database
    const getVariables = () => ({ models });
    Query({
      query,
      queryName,
      getVariables,
      handleResponse: (response) => {
        console.log(response);
        if (response.success) {
          toast.success(`Successfully imported ${models.length} models!`, {
            toastId: 1,
          });
          renderTable(models);
          resetUpload();
        } else {
          toast.error(response.message, {
            toastId: 1,
          });
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
      <CustomUpload
        requiredHeaders={requiredHeaders}
        customHeaderTransform={customHeaderTransform}
        customTransform={customTransform}
        uploadLabel={uploadLabel}
        handleImport={handleImport}
        importStatus={importStatus}
      />
      <ModalAlert handleClose={closeModal} show={show} title="Error Importing Models" width=" ">
        <ImportModelError allRowErrors={allRowErrors} errorList={[]} />
      </ModalAlert>
      {showTable && <DisplayGrid rows={rows} cols={cols} />}
    </>
  );
}
