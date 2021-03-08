/* eslint-disable react/forbid-prop-types */
import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CustomUpload({
  requiredHeaders, customHeaderTransform, customTransform, uploadLabel, handleImport,
}) {
  CustomUpload.propTypes = {
    requiredHeaders: PropTypes.array.isRequired,
    customHeaderTransform: PropTypes.func.isRequired,
    customTransform: PropTypes.func.isRequired,
    uploadLabel: PropTypes.string.isRequired,
    handleImport: PropTypes.func.isRequired,
  };
  const [status, setStatus] = useState('Submit');
  const buttonRef = createRef();

  const resetUpload = () => {
    setStatus('Submit');
  };

  const validateHeader = (row) => {
    const missingHeaders = [];
    const availableHeaders = Object.keys(row);
    requiredHeaders.forEach((header) => {
      if (!availableHeaders.includes(header.value)) missingHeaders.push(header.display);
    });
    return missingHeaders;
  };

  const validateContents = () => {
    setStatus('Validating Contents');
    return true;
  };

  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const extractData = (data) => data.map((row) => row.data);

  const handleOnFileLoad = (data) => {
    // Validate headers immediately
    if (data.length === 0) {
      toast.error('Please submit a non empty file');
      resetUpload();
      return;
    }

    const row = data[0].data;
    const missingHeaders = validateHeader(row);
    if (missingHeaders) {
      toast.error(`Missing the following headers: ${missingHeaders}`);
      resetUpload();
      return;
    }

    // At this point, you know headers are correct
    const fileInfo = extractData(data);
    handleImport(fileInfo);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
    console.log(file);
    console.log(inputElem);
    console.log(reason);
  };

  const handleOnRemoveFile = () => {
    console.log('removing file');
  };

  const handleRemoveFile = (e) => {
    resetUpload();
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const submitFileContents = () => {
    setStatus('Preparing Transactions');
  };

  // TODO: Add batching for massive files (test this)
  const papaparseOptions = {
    header: true,
    skipEmptyLines: true,
    transformHeader: customHeaderTransform,
    transform: customTransform,
  };

  // TODO: Send file to backend (for now spoofing)
  const handleSubmitFile = () => {
    if (validateContents()) {
      setTimeout(() => {
        submitFileContents();
        setTimeout(() => {
          handleRemoveFile();
        }, 1000);
      }, 1000);
    }
  };

  return (
    <>
      <ToastContainer />
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
      >
        {({ file }) => (
          <div
            className="m-2"
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10,
              width: '50%',
            }}
          >
            <button
              className="m-2"
              type="button"
              onClick={handleOpenDialog}
              style={{
                borderRadius: 5,
                width: '40%',
              }}
            >
              { uploadLabel }
            </button>
            <p className="m-2" style={{ marginTop: '12px' }}>
              {file && file.name}
            </p>
            {file && file.name
          && (
            <>
              <Button
                className="m-2"
                type="submit"
                onClick={handleSubmitFile}
                style={{ borderRadius: 5 }}
              >
                {status}
              </Button>
              {status === 'Submit'
                ? (
                  <Button
                    className="m-2"
                    type="submit"
                    onClick={handleRemoveFile}
                    style={{ background: '#fc2311', borderRadius: 5 }}
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
