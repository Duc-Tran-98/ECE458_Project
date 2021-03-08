import React, { useState } from 'react';

import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';

const buttonRef = React.createRef();

export default function PapaparseTest() {
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('black');

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    console.log(data);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
    console.log(file);
    console.log(inputElem);
    console.log(reason);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const submitFileContents = () => {
    setStatus('Preparing Transactions');
    setStatusColor('orange');
  };

  const validateContents = () => {
    setStatus('Parsing');
    setStatusColor('blue');
  };

  const handleSubmitFile = (e) => {
    // Send file to backend
    setTimeout(() => {
      validateContents();
    }, 1000);
    setTimeout(() => {
      submitFileContents();
    }, 1000);
    handleRemoveFile(e);
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
    >
      {({ file }) => (
        <aside
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 10,
          }}
        >
          <button
            className="m-2"
            type="button"
            onClick={handleOpenDialog}
            style={{
              borderRadius: 5,
              width: '20%',
            }}
          >
            Select Instruments File
          </button>
          <div
            style={{
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#ccc',
              height: 30,
              lineHeight: 2.5,
              marginTop: 5,
              marginBottom: 5,
              paddingLeft: 13,
              paddingTop: 3,
              width: '40%',
            }}
          >
            {file && file.name}
          </div>
          {file && file.name
          && (
            <>
              <Button
                className="m-2"
                type="submit"
                onClick={handleSubmitFile}
                style={{ borderRadius: 5 }}
              >
                Submit
              </Button>
              <Button
                className="m-2"
                type="submit"
                onClick={handleRemoveFile}
                style={{ background: '#fc2311', borderRadius: 5 }}
              >
                Remove
              </Button>

            </>
          )}
          {status && <p style={{ color: { statusColor } }}>{status}</p>}
        </aside>
      )}
    </CSVReader>
  );
}
