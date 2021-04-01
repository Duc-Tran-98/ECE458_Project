/* eslint-disable eqeqeq */
import React from 'react';
import { toast } from 'react-toastify';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import Query from './UseQuery';
import CustomUpload from './CustomUpload';
import { StateLessModal } from './ModalAlert';
import ImportModelError from './ImportModelError';
import DisplayGrid from './UITable';

export default function ImportModels() {
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
    { display: 'Short-Description', value: 'description' },
    { display: 'Comment', value: 'comment' },
    { display: 'Model-Categories', value: 'categories' },
    { display: 'Special-Calibration-Support', value: 'specialCalibrationSupport' },
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
  const query = IMPORT_MODELS;
  const queryName = 'bulkImportModels';

  const isNA = (calibrationFrequency) => {
    if (typeof (calibrationFrequency) === 'string') {
      const lower = calibrationFrequency.toLowerCase();
      return lower == 'n/a' || lower == 'na';
    }
    return false;
  };
  const renderTable = (models) => {
    const filteredData = models.map((obj) => ({
      id: String(obj.vendor + obj.modelNumber),
      vendor: String(obj.vendor),
      modelNumber: String(obj.modelNumber),
      description: String(obj.description),
      ...(obj.comment) && { comment: String(obj.comment) },
      ...(!isNA(obj.calibrationFrequency)) && { calibrationFrequency: parseInt(obj.calibrationFrequency, 10) },
    }));
    setRow(filteredData);
    setShowTable(true);
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
<<<<<<< HEAD
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    }, {
      field: 'calibrationFrequency',
      headerName: 'Calibration-Frequency',
      width: 200,
      renderCell: (params) => ((params.value >= 0) ? params.value : ' '),
    },
=======
    }, { field: 'calibrationFrequency', headerName: 'Calibration-Frequency', width: 200 },
>>>>>>> 43f6ee102f4e31c7f3c9f08178815d4a2e9301e4
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

  const invalidCalibrationSupport = (calibrationSupport) => {
    if (calibrationSupport === null) { return false; }
    if (typeof (calibrationSupport) !== 'string') { return false; }
    const lower = calibrationSupport.toLowerCase();
    return !(lower === 'load-bank' || lower === 'klufe');
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
    if (calibrationFrequency) {
      // Know value is a string, no filtering/dynamic typing performed
      return parseInt(calibrationFrequency, 10) > 0 || isNA(calibrationFrequency);
    }
    // No calibration frequency given
    return false;
  };

  // const emptyLine = (obj) => !Object.values(obj).every((x) => x == null);

  const getImportErrors = (fileInfo) => {
    const importRowErrors = [];
    fileInfo.forEach((row, index) => {
      // Maybe add emptyLine check, greedy parse seems to be working well...
      const missingKeys = getMissingKeys(row);
      const isDuplicateModel = checkDuplicateModel(fileInfo, row.vendor, row.modelNumber, index);
      const invalidEntries = validateRow(row);
      const invalidCalibration = !validateCalibrationFrequency(row.calibrationFrequency);
      const invalidSpecialCalibrationSupport = invalidCalibrationSupport(row.specialCalibrationSupport);

      // If any errors exist, create errors object
      if (missingKeys || invalidEntries || invalidCalibration || isDuplicateModel || invalidSpecialCalibrationSupport) {
        const rowError = {
          data: row,
          row: index + 2,
          ...(missingKeys) && { missingKeys },
          ...(invalidEntries) && { invalidEntries },
          ...(isDuplicateModel) && { isDuplicateModel },
          ...(invalidCalibration) && { invalidCalibration },
          ...(invalidSpecialCalibrationSupport) && { invalidSpecialCalibrationSupport },
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
    description: String(obj.description),
    categories: obj.categories,
    supportLoadBankCalibration: (obj.specialCalibrationSupport && typeof (obj.specialCalibrationSupport) === 'string' && obj.specialCalibrationSupport.toLowerCase() === 'load-bank') || false,
    supportKlufeCalibration: (obj.specialCalibrationSupport && typeof (obj.specialCalibrationSupport) === 'string' && obj.specialCalibrationSupport.toLowerCase() === 'klufe') || false,
    comment: String(obj.comment),
    calibrationFrequency: parseInt(obj.calibrationFrequency, 10) > 0 ? parseInt(obj.calibrationFrequency, 10) : null,
  }));

  const handleImport = (fileInfo, resetUpload) => {
    setImportStatus('Validating');
    if (!validateFile(fileInfo)) {
      resetState();
      return;
    }

    setImportStatus('Registering');
    // File has been validated, now push to database
    const models = filterData(fileInfo);
    const getVariables = () => ({ models });
    const refetch = JSON.parse(window.sessionStorage.getItem('getModelsWithFilter')) || null;
    const refetchQueries = refetch !== null
      ? [
        {
          query: refetch.query,
          variables: refetch.variables,
        },
      ]
      : [];
    Query({
      query,
      queryName,
      getVariables,
      refetchQueries,
      handleResponse: (response) => {
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
        resetState();
      },
      handleError: (err) => {
        toast.error(err);
        resetUpload();
        resetState();
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
      <StateLessModal handleClose={closeModal} show={show} title="Error Importing Models" width=" ">
        <ImportModelError allRowErrors={allRowErrors} errorList={[]} />
      </StateLessModal>
      {showTable && <DisplayGrid rows={rows} cols={cols} />}
    </>
  );
}
