import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { camelCase } from 'lodash';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from './UseQuery';
import CustomUpload from './CustomUpload';
// import ModalAlert from './ModalAlert';
// import ImportModelError from './ImportModelError';
// import DisplayGrid from './UITable';

export default function ImpModels() {
  const [csvData, setCSVData] = React.useState([]);
  // const [show, setShow] = useState(false);
  // const [showTable, setShowTable] = useState(false);
  // const [importCount, setImportCount] = useState(0);
  // const closeModal = () => {
  //   setShow(false);
  //   setAllRowErrors([]);
  //   setAllQueryErrors([]);
  // };

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
      $filteredData: [ModelInput]!
    ) {
      bulkImportModels(models: $filteredData)
    }
  `;
  const query = print(IMPORT_MODELS);
  const queryName = 'bulkImportModels';
  const renderTable = (fileInfo) => {
    toast('TODO render table with fileInfo');
    console.log(fileInfo);
  };

  // TODO: Implement me! (maybe not needed with transform?)
  const filterData = (fileInfo) => fileInfo;

  const handleQueryResponse = (response) => {
    console.log(response);
    if (response.success) {
      toast.success(`Successfully imported ${csvData.length} models!`);
      renderTable(csvData);
    } else {
      // TODO: Display errors correctly
      toast.error(response.errorList);
    }
  };

  const handleImport = (fileInfo) => {
    console.log('Handling import');
    const filteredData = filterData(fileInfo);
    setCSVData(filteredData);
    const getVariables = () => ({ filteredData });
    Query({
      query,
      queryName,
      getVariables,
      handleResponse: handleQueryResponse,
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
      />
      {/* <ModalAlert handleClose={closeModal} show={show} title="Error Importing Models">
        <ImportModelError allRowErrors={allRowErrors} errorList={allQueryErrors} />
      </ModalAlert> */}
      {/* <div style={{
        display: showTable ? 'inline-block' : 'none',
        width: showTable ? '100%' : '0',
        height: 'auto',
      }}
      >
        <h2 className="m-2">
          {`Successfully Imported ${importCount} ${importCount === 1 ? 'Model' : 'Models'}`}
        </h2>
        <DisplayGrid rows={csvData} cols={cols} />
      </div> */}
    </>
  );
}
