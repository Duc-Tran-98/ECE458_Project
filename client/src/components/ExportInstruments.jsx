/* eslint-disable no-nested-ternary */
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MouseOverPopover from './PopOver';
import GetInstrumentsForExport from '../queries/GetInstrumentsForExport';
import { ExportButton } from './CustomMuiIcons';

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
            : (row.recentCalibration[0].klufeData ? 'Calibrated via Klufe Calibrator'
              : (row.recentCalibration[0].customFormData ? 'Calibrated with Custom Form' : ''))))
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
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
        // console.log(e);
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

export const ExportInstrumentsIcon = ({ setLoading, filterOptions }) => {
  ExportInstrumentsIcon.propTypes = {
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
      // eslint-disable-next-line no-unused-vars
      .catch((e) => {
        // console.log(e);
      });
    setLoading(false);
    csvLink.current.link.click();
  };

  return (
    <>
      <ExportButton onClick={getTransactionData} />
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
