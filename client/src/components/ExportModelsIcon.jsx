import { CSVLink } from 'react-csv';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PopOverFragment } from './PopOver';
import GetModelsForExport from '../queries/GetModelsForExport';
import { ExportButton } from './CustomMuiIcons';

// eslint-disable-next-line no-unused-vars
export default function ExportModelsIcon({ setLoading, filterOptions, showText }) {
  ExportModelsIcon.propTypes = {
    setLoading: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
    showText: PropTypes.bool.isRequired, // whether or not to show text
  };

  const [transactionData, setTransactionData] = useState([]);

  let csvData = '1,2,3';
  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Short-Description', key: 'description' },
    { label: 'Comment', key: 'comment' },
    { label: 'Model-Categories', key: 'categories' },
    { label: 'Special-Calibration-Support', key: 'specialCalibration' },
    { label: 'Calibration-Frequency', key: 'calibrationFrequency' },
  ];

  const getData = async () => {
    await GetModelsForExport({ filterOptions }).then((res) => {
      csvData = res;
    });
    return csvData;
  };

  const filterTransactionData = (r) => {
    const filteredData = [];
    r.models.forEach((row) => {
      const updatedRow = {
        vendor: row.vendor.replace(/"/g, '""'),
        modelNumber: row.modelNumber.replace(/"/g, '""'),
        description: row.description.replace(/"/g, '""'),
        comment: row.comment ? row.comment.replace(/"/g, '""') : '',
        calibrationFrequency: row.calibrationFrequency || 'N/A',
        // eslint-disable-next-line no-nested-ternary
        specialCalibration: row.supportLoadBankCalibration ? 'Load-Bank' : (row.supportKlufeCalibration ? 'Klufe' : ''),
        categories: row.categories.map((item) => item.name).join(' '),
      };
      filteredData.push(updatedRow);
    });
    return filteredData;
  };

  // const csvLink = useRef < { link: HTMLAnchorElement } > (null); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  const csvLink = useRef();
  useEffect(() => {
    console.log('csvLink inside ExportModelsIcon: ');
    console.log(csvLink);
  }, [csvLink]);

  const getTransactionData = async () => {
    console.log('csvLink: ');
    console.log(csvLink);
    console.log('Getting transaction data');
    setLoading(true);
    await getData()
      .then((r) => {
        console.log('Got transaction data');
        const filteredData = filterTransactionData(r);
        console.log(filteredData);
        setTransactionData(filteredData);
      })
      .catch((e) => console.log(e));
    setLoading(false);
    console.log('csvLink: ');
    console.log(csvLink);
    csvLink.current.link.click();
  };

  return (
    <>
      <ExportButton onClick={getTransactionData} />
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
}
