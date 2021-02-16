import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import GetInstrumentsForExport from '../queries/GetInstrumentsForExport';

const ExportInstruments = ({ setLoading }) => {
  ExportInstruments.propTypes = {
    setLoading: PropTypes.func.isRequired,
  };
  const [transactionData, setTransactionData] = useState([]);

  let csvData = '1,2,3';
  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'recentCalDate' },
    { label: 'Calibration-Comment', key: 'recentCalComment' },
  ];

  const getData = async () => {
    await GetInstrumentsForExport().then((res) => {
      csvData = res;
    });
    return csvData;
  };

  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const getTransactionData = async () => {
    setLoading(true);
    await getData()
      .then((r) => {
        setTransactionData(r);
      })
      .catch((e) => console.log(e));
    setLoading(false);
    csvLink.current.link.click();
  };

  return (
    <>
      <Button onClick={getTransactionData} className="m-2">Export All Instruments</Button>
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
