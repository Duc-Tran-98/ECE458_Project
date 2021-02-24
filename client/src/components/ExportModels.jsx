import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import GetModelsForExport from '../queries/GetModelsForExport';

const ExportModels = ({ setLoading }) => {
  ExportModels.propTypes = {
    setLoading: PropTypes.func.isRequired,
  };

  const [transactionData, setTransactionData] = useState([]);

  let csvData = '1,2,3';
  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Short-Description', key: 'description' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Frequency', key: 'calibrationFrequency' },
  ];

  const getData = async () => {
    await GetModelsForExport().then((res) => {
      csvData = res;
    });
    return csvData;
  };

  const filterTransactionData = (r) => {
    const filteredData = [];
    r.forEach((row) => {
      const updatedRow = {
        vendor: row.vendor.replace(/"/g, '""'),
        modelNumber: row.modelNumber.replace(/"/g, '""'),
        description: row.description.replace(/"/g, '""'),
        comment: row.comment.replace(/"/g, '""'),
        calibrationFrequency: row.calibrationFrequency,
      };
      filteredData.push(updatedRow);
    });
    return filteredData;
  };

  const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const getTransactionData = async () => {
    setLoading(true);
    await getData()
      .then((r) => {
        const filteredData = filterTransactionData(r);
        setTransactionData(filteredData);
      })
      .catch((e) => console.log(e));
    setLoading(false);
    csvLink.current.link.click();
  };

  return (
    <>
      <Button onClick={getTransactionData} className="m-3 btn-dark">Export All Models</Button>
      <CSVLink
        data={transactionData}
        headers={headers}
        filename="models.csv"
        className="hidden"
        ref={csvLink}
        enclosingCharacter={'"'}
      />
    </>
  );
};

export default ExportModels;
