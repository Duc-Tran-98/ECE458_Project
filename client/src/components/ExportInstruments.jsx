import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import GetInstrumentsForExport from '../queries/GetInstrumentsForExport';

const ExportInstruments = () => {
  const [transactionData, setTransactionData] = useState([]);

  let csvData = '1,2,3';
  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'calibrationDate' },
    { label: 'Calibration-Comment', key: 'calibrationComment' },
  ];

  const getData = async () => {
    await GetInstrumentsForExport().then((res) => {
      csvData = res;
    });
    return csvData;
  };

  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const getTransactionData = async () => {
    await getData()
      .then((r) => {
        setTransactionData(r);
      })
      .catch((e) => console.log(e));
    csvLink.current.link.click();
  };

  return (
    <>
      <div>
        <Button onClick={getTransactionData}>Export All Instruments</Button>
        <CSVLink
          data={transactionData}
          headers={headers}
          filename="instruments.csv"
          className="hidden"
          ref={csvLink}
        />
      </div>

    </>
  );
};

export default ExportInstruments;
