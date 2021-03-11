/* eslint-disable react/forbid-prop-types */
import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CustomUpload({
  requiredHeaders, customHeaderTransform, customTransform, uploadLabel, handleImport, importStatus, hideTable,
}) {
  CustomUpload.propTypes = {
    requiredHeaders: PropTypes.array.isRequired,
    customHeaderTransform: PropTypes.func.isRequired,
    customTransform: PropTypes.func.isRequired,
    uploadLabel: PropTypes.string.isRequired,
    handleImport: PropTypes.func.isRequired,
    importStatus: PropTypes.string.isRequired,
    hideTable: PropTypes.func.isRequired,
  };

  const [fileInfo, setFileInfo] = useState([]);
  const [shouldReset, setReset] = useState(false);
  const [show, setShow] = useState(false);
  const buttonRef = createRef();

  const resetUpload = () => {
    setReset(true);
    setReset(false);
    setShow(false);
  };

  const validateHeader = (row) => {
    const missingHeaders = [];
    const availableHeaders = Object.keys(row); // Object.keys(row);
    requiredHeaders.forEach((header) => {
      if (!availableHeaders.includes(header.value)) missingHeaders.push(header.display);
    });
    return missingHeaders;
  };

  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const extractData = (data) => data.map((row) => row.data);

  const handleOnFileLoad = (data) => {
    hideTable();
    // Validate non empty file
    if (data.length === 0) {
      toast.error('Please submit a non empty UTF-8 CSV file', {
        toastId: 1,
      });
      resetUpload();
      return;
    }

    // Validate headers next
    const row = data[0].data;
    const missingHeaders = validateHeader(row);
    if (missingHeaders.length > 0) {
      toast.error(`Missing the following headers: ${missingHeaders}`, {
        toastId: 12,
      });
      resetUpload();
      return;
    }

    // Headers validated, handle import
    setShow(true);
    setFileInfo(extractData(data));
  };

  // TODO: What can cause an error here?
  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
    console.log(file);
    console.log(inputElem);
    console.log(reason);
    toast.error('Sorry, something went wrong, please try again', {
      toastId: 4,
    });
  };

  const handleOnRemoveFile = () => {};

  const handleRemoveFile = (e) => {
    resetUpload();
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const submitFileContents = () => {
    handleImport(fileInfo, resetUpload);
  };

  // TODO: Add batching for massive files (test this)
  // TODO: Remove carriage return in customTransform
  const papaparseOptions = {
    header: true, // false
    skipEmptyLines: 'greedy',
    newline: '\n',
    transformHeader: customHeaderTransform,
    transform: customTransform,
  };

  const handleSubmitFile = () => {
    submitFileContents(handleRemoveFile);
  };

  return (
    <>
      <CSVReader
        ref={buttonRef}
        onFileLoad={handleOnFileLoad}
        onError={handleOnError}
        noClick
        noDrag
        onRemoveFile={handleOnRemoveFile}
        accept="text/csv, .csv"
        noProgressBar
        // progressBarColor="#fca311"
        config={papaparseOptions}
        isReset={shouldReset}
      >
        {({ file }) => (
          <div className="m-2">
            <Button
              className="m-2"
              type="button"
              onClick={handleOpenDialog}
              style={{
                background: '#ffffff',
                borderRadius: 5,
                width: '300px',
              }}
            >
              { uploadLabel }
            </Button>
            <p className="m-2" style={{ marginTop: '12px' }}>
              {file && file.name}
            </p>
            {show
          && (
            <>
              <Button
                className="m-2"
                type="submit"
                onClick={handleSubmitFile}
                style={{ borderRadius: 5 }}
              >
                {importStatus}
              </Button>
              {importStatus === 'Import'
                ? (
                  <Button
                    className="btn btn-danger"
                    type="submit"
                    onClick={handleRemoveFile}
                    // style={{ background: '#fc2311', borderRadius: 5 }}
                  >
                    Remove
                  </Button>
                ) : <CircularProgress />}
            </>
          )}
          </div>
        )}
      </CSVReader>
    </>
  );
}
