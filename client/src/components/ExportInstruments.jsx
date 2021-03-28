/* eslint-disable no-nested-ternary */
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MouseOverPopover, { PopOverFragment } from './PopOver';
import GetInstrumentsForExport from '../queries/GetInstrumentsForExport';

const ExportInstruments = ({ setLoading, filterOptions }) => {
  ExportInstruments.propTypes = {
    setLoading: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
  };
  const [transactionData, setTransactionData] = useState([]);

  let csvData = '1,2,3';
  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Asset-Tag-Number', key: 'assetTag' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'calibrationDate' },
    { label: 'Calibration-Comment', key: 'calibrationComment' },
    { label: 'Instrument-Categories', key: 'instrumentCategories' },
    { label: 'Calibration-Attachment-Type', key: 'calibrationType' },
  ];

  const getData = async () => {
    await GetInstrumentsForExport({ filterOptions }).then((res) => {
      csvData = res;
    });
    return csvData;
  };

  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const filterTransactionData = (r) => {
    const filteredData = [];
    r.instruments.forEach((row) => {
      const updatedRow = {
        vendor: row.vendor.replace(/"/g, '""'),
        modelNumber: row.modelNumber.replace(/"/g, '""'),
        serialNumber: row.serialNumber ? row.serialNumber.replace(/"/g, '""') : '',
        assetTag: row.assetTag,
        comment: row.comment ? row.comment.replace(/"/g, '""') : '',
        instrumentCategories: row.instrumentCategories.map((item) => item.name).join(' '),
        calibrationDate: (typeof row.recentCalibration[0] !== 'undefined' && row.recentCalibration[0].date) ? row.recentCalibration[0].date : '',
        calibrationComment: (typeof row.recentCalibration[0] !== 'undefined' && row.recentCalibration[0].comment) ? row.recentCalibration[0].comment : '',
        calibrationType: typeof row.recentCalibration[0] !== 'undefined' ? (row.recentCalibration[0].fileName ? `Attached file ${row.recentCalibration[0].fileName}`
          : (row.recentCalibration[0].loadBankData ? 'Calibrated via Load Bank Wizard'
            : (row.recentCalibration[0].klufeData ? 'Calibrated via Klufe Calibrator' : '')))
          : '',
      };
      filteredData.push(updatedRow);
    });
    return filteredData;
  };

  const getTransactionData = async () => {
    setLoading(true);
    await getData()
      .then((r) => {
        const filteredData = filterTransactionData(r);
        setTransactionData(filteredData);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
    csvLink.current.link.click();
  };

  return (
    <>
      <Button onClick={getTransactionData} className="btn ms-3">
        <MouseOverPopover message="Export all instruments with current filters" place="top">
          <div>
            Export Instruments
          </div>
        </MouseOverPopover>
      </Button>
      <CSVLink
        data={transactionData}
        headers={headers}
        filename="instruments.csv"
        className="hidden"
        ref={csvLink}
      />
    </>
  );
};

export default ExportInstruments;

export const ExportInstrumentsIcon = ({ setLoading, filterOptions, showText }) => {
  ExportInstrumentsIcon.propTypes = {
    setLoading: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
    showText: PropTypes.bool.isRequired,
  };
  const [transactionData, setTransactionData] = useState([]);

  let csvData = '1,2,3';
  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Asset-Tag-Number', key: 'assetTag' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'calibrationDate' },
    { label: 'Calibration-Comment', key: 'calibrationComment' },
    { label: 'Instrument-Categories', key: 'instrumentCategories' },
    { label: 'Calibration-Attachment-Type', key: 'calibrationType' },
  ];

  const getData = async () => {
    await GetInstrumentsForExport({ filterOptions }).then((res) => {
      csvData = res;
    });
    return csvData;
  };

  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const filterTransactionData = (r) => {
    const filteredData = [];
    r.instruments.forEach((row) => {
      const updatedRow = {
        vendor: row.vendor.replace(/"/g, '""'),
        modelNumber: row.modelNumber.replace(/"/g, '""'),
        serialNumber: row.serialNumber ? row.serialNumber.replace(/"/g, '""') : '',
        assetTag: row.assetTag,
        comment: row.comment ? row.comment.replace(/"/g, '""') : '',
        instrumentCategories: row.instrumentCategories.map((item) => item.name).join(' '),
        calibrationDate: (typeof row.recentCalibration[0] !== 'undefined' && row.recentCalibration[0].date) ? row.recentCalibration[0].date : '',
        calibrationComment: (typeof row.recentCalibration[0] !== 'undefined' && row.recentCalibration[0].comment) ? row.recentCalibration[0].comment : '',
        calibrationType: typeof row.recentCalibration[0] !== 'undefined' ? (row.recentCalibration[0].fileName ? `Attached file ${row.recentCalibration[0].fileName}`
          : (row.recentCalibration[0].loadBankData ? 'Calibrated via Load Bank Wizard'
            : (row.recentCalibration[0].klufeData ? 'Calibrated via Klufe Calibrator' : '')))
          : '',
      };
      filteredData.push(updatedRow);
    });
    return filteredData;
  };

  const getTransactionData = async () => {
    setLoading(true);
    await getData()
      .then((r) => {
        const filteredData = filterTransactionData(r);
        setTransactionData(filteredData);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
    csvLink.current.link.click();
  };

  return (
    <>
      <button onClick={getTransactionData} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
        <PopOverFragment message="Export all instrument with current filters">
          <span className="MuiButton-label">
            <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
              <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
            </span>
            {showText && 'Export'}
          </span>
        </PopOverFragment>
        <span className="MuiTouchRipple-root" />
      </button>
      <CSVLink
        data={transactionData}
        headers={headers}
        filename="instruments.csv"
        className="hidden"
        ref={csvLink}
      />
    </>
  );
};
