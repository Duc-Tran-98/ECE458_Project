/* eslint-disable no-unused-vars */
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import MouseOverPopover from './PopOver';
import ExpressQuery from '../queries/ExpressQuery';
import { GetAssetTags } from '../queries/GetInstrumentsForExport';

const download = require('downloadjs');

const fs = require('fs');

const GenerateBarcodes = ({ filterOptions, assetTags, getAll }) => {
  GenerateBarcodes.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    assetTags: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
    getAll: PropTypes.bool.isRequired,
  };

  const handleResponse = (response) => {
    console.log(response);
    // create pdf from bytestream and download in browser
    const blob = new Blob([response.data], { type: 'application/pdf' });
    download(blob, 'asset_labels.pdf', 'application/pdf');
  };

  const barcodeQuery = async () => {
    // ExpressQuery({
    //   endpoint: '/api/barcodes?tags[]=222222&tags[]=124600&tags[]=121199', method: 'get', queryJSON: { }, handleResponse, responseType: 'arraybuffer',
    // });
    if (!getAll && assetTags.length < 1) {
      toast.error('Check at least one instrument to generate barcodes');
      return;
    }
    let tagsToGenerate;
    let expressParam = '/api/barcodes?';
    if (getAll) {
      // await GetAssetTags({ filterOptions }).then((res) => {
      //   tagsToGenerate = res.instruments.map((a) => a.assetTag);
      // });
      expressParam = expressParam.concat('all=true');
    } else {
      tagsToGenerate = assetTags;
      for (let i = 0; i < tagsToGenerate.length; i += 1) {
        expressParam = expressParam.concat(`${i === 0 ? '' : '&'}tags[]=${tagsToGenerate[i]}`);
      }
    }
    ExpressQuery({
      endpoint: expressParam, method: 'get', queryJSON: { }, handleResponse, responseType: 'arraybuffer',
    });
  };

  return (
    <>
      <Button onClick={barcodeQuery} variant="dark" className="ms-3">
        <MouseOverPopover message="Generate barcodes for all checked instruments with current filters" place="top">
          <div>
            Generate Barcodes
          </div>
        </MouseOverPopover>
      </Button>
    </>
  );
};

export default GenerateBarcodes;
