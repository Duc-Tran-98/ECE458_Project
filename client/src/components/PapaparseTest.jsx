import React, { useState, createRef } from 'react';

import { camelCase } from 'lodash';
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function PapaparseTest() {
  const [status, setStatus] = useState('Submit');
  const buttonRef = createRef();
  const [fileInfo, setFileInfo] = useState([]);

  const handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const extractData = (data) => data.map((row) => row.data);

  const handleOnFileLoad = (data) => {
    console.log(data);
    setFileInfo(extractData(data));
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
    setStatus('Submit');
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const submitFileContents = () => {
    setStatus('Preparing Transactions');
  };

  const validateContents = () => {
    setStatus('Validating Contents');
    console.log(fileInfo);
  };

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
        return value.split(/\s+/);
      default:
        return value.trim();
    }
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
    validateContents();
    setTimeout(() => {
      submitFileContents();
      setTimeout(() => {
        handleRemoveFile();
      }, 1000);
    }, 1000);
  };

  return (
    <CSVReader
      ref={buttonRef}
      onFileLoad={handleOnFileLoad}
      onError={handleOnError}
      noClick
      noDrag
      onRemoveFile={handleOnRemoveFile}
      accept="text/csv, .csv"
      progressBarColor="#fca311"
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
            Select Instruments File
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
  );
}
