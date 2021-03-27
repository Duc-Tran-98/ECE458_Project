/* eslint-disable no-unused-vars */
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import MouseOverPopover, { PopOverFragment } from './PopOver';
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

  const [loading, setLoading] = React.useState(false);

  const handleResponse = (response) => {
    // create pdf from bytestream and download in browser
    const blob = new Blob([response.data], { type: 'application/pdf' });
    download(blob, 'asset_labels.pdf', 'application/pdf');
    setLoading(false);
  };

  const barcodeQuery = async () => {
    if (!getAll && assetTags.length < 1) {
      toast.error('Check at least one instrument to generate barcodes');
      return;
    }
    setLoading(true);
    let tagsToGenerate;
    let expressParam = '/api/barcodes?';
    if (getAll) {
      expressParam = expressParam.concat('all=true');
      if (filterOptions.vendors) expressParam += `&vendor=${filterOptions.vendors}`;
      if (filterOptions.modelNumbers) expressParam += `&modelNumber=${filterOptions.modelNumbers}`;
      if (filterOptions.assetTag) expressParam += `&assetTag=${filterOptions.assetTag}`;
      if (filterOptions.descriptions) expressParam += `&description=${filterOptions.descriptions}`;
      if (filterOptions.filterSerialNumber) expressParam += `&serialNumber=${filterOptions.filterSerialNumber}`;
      if (filterOptions.modelCategories) {
        for (let i = 0; i < filterOptions.modelCategories.length; i += 1) {
          expressParam += `&modelCat[]=${filterOptions.modelCategories[i]}`;
        }
      }
      if (filterOptions.instrumentCategories) {
        for (let i = 0; i < filterOptions.instrumentCategories.length; i += 1) {
          expressParam += `&instCat[]=${filterOptions.instrumentCategories[i]}`;
        }
      }
    } else {
      tagsToGenerate = assetTags;
      for (let i = 0; i < tagsToGenerate.length; i += 1) {
        expressParam += `${i === 0 ? '' : '&'}tags[]=${tagsToGenerate[i]}`;
      }
    }
    if (!loading) {
      ExpressQuery({
        endpoint: expressParam, method: 'get', queryJSON: { }, handleResponse, responseType: 'arraybuffer',
      });
    }
  };

  return (
    <>
      <Button onClick={barcodeQuery} variant="dark" className="ms-3">
        <MouseOverPopover message="Generate barcodes for all checked instruments with current filters" place="top">
          {loading ? (
            <div>
              Generating...
            </div>
          )
            : (
              <div>
                Generate Barcodes
              </div>
            )}
        </MouseOverPopover>
      </Button>
    </>
  );
};

export default GenerateBarcodes;

export const GenerateBarcodesIcon = ({ filterOptions, assetTags, getAll }) => {
  GenerateBarcodesIcon.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    assetTags: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
    getAll: PropTypes.bool.isRequired,
  };

  const [loading, setLoading] = React.useState(false);

  const handleResponse = (response) => {
    // create pdf from bytestream and download in browser
    const blob = new Blob([response.data], { type: 'application/pdf' });
    download(blob, 'asset_labels.pdf', 'application/pdf');
    setLoading(false);
  };

  const barcodeQuery = async () => {
    if (!getAll && assetTags.length < 1) {
      toast.error('Check at least one instrument to generate barcodes');
      return;
    }
    setLoading(true);
    let tagsToGenerate;
    let expressParam = '/api/barcodes?';
    if (getAll) {
      expressParam = expressParam.concat('all=true');
      if (filterOptions.vendors) expressParam += `&vendor=${filterOptions.vendors}`;
      if (filterOptions.modelNumbers) expressParam += `&modelNumber=${filterOptions.modelNumbers}`;
      if (filterOptions.assetTag) expressParam += `&assetTag=${filterOptions.assetTag}`;
      if (filterOptions.descriptions) expressParam += `&description=${filterOptions.descriptions}`;
      if (filterOptions.filterSerialNumber) expressParam += `&serialNumber=${filterOptions.filterSerialNumber}`;
      if (filterOptions.modelCategories) {
        for (let i = 0; i < filterOptions.modelCategories.length; i += 1) {
          expressParam += `&modelCat[]=${filterOptions.modelCategories[i]}`;
        }
      }
      if (filterOptions.instrumentCategories) {
        for (let i = 0; i < filterOptions.instrumentCategories.length; i += 1) {
          expressParam += `&instCat[]=${filterOptions.instrumentCategories[i]}`;
        }
      }
    } else {
      tagsToGenerate = assetTags;
      for (let i = 0; i < tagsToGenerate.length; i += 1) {
        expressParam += `${i === 0 ? '' : '&'}tags[]=${tagsToGenerate[i]}`;
      }
    }
    if (!loading) {
      ExpressQuery({
        endpoint: expressParam, method: 'get', queryJSON: { }, handleResponse, responseType: 'arraybuffer',
      });
    }
  };

  return (
    <>
      <button onClick={barcodeQuery} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
        <PopOverFragment message="Generate barcodes of selected instruments">
          <span className="MuiButton-label">
            <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
              <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
              </svg>
            </span>
          </span>
        </PopOverFragment>
        <span className="MuiTouchRipple-root" />
      </button>
    </>
  );
};
