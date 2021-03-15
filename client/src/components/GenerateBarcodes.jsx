/* eslint-disable no-unused-vars */
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ExpressQuery from '../queries/ExpressQuery';

const download = require('downloadjs');

const fs = require('fs');

const GenerateBarcodes = ({ filterOptions }) => {
  GenerateBarcodes.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
  };

  const handleResponse = (response) => {
    // create pdf from bytestream and download in browser
    const blob = new Blob([response.data], { type: 'application/pdf' });
    download(blob, 'asset_labels.pdf', 'application/pdf');
  };

  const barcodeQuery = () => {
    ExpressQuery({
      endpoint: '/api/barcodes?tags[]=222222&tags[]=124600&tags[]=121199', method: 'get', queryJSON: { }, handleResponse, responseType: 'arraybuffer',
    });
  };

  return (
    <>
      <Button onClick={barcodeQuery} variant="dark" className="ms-3">
        Generate Barcodes
      </Button>
    </>
  );
};

export default GenerateBarcodes;
