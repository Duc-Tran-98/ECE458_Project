/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllInstruments from '../queries/GetAllInstruments';
import MouseOverPopover from '../components/PopOver';
import SearchBar from '../components/SearchBar';
import Query from '../components/UseQuery';
import UserContext from '../components/UserContext';

// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days) { // This allows you to add days to a date object and get a new date object
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default function ListInstruments() {
  const history = useHistory();
  const user = React.useContext(UserContext);
  const [modelNumber, setModelNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [calibrationFrequency, setcalibrationFrequency] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [rowCount, setRowCount] = useState(parseInt(urlParams.get('count'), 10));
  const [initPage, setInitPage] = useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = useState(
    parseInt(urlParams.get('limit'), 10),
  );
  const urlFilter = urlParams.get('filters');
  let selectedFilters = null;
  if (urlFilter) {
    selectedFilters = JSON.parse(
      Buffer.from(urlFilter, 'base64').toString('ascii'),
    );
    // console.log(selectedFilters);
  }
  const [filterOptions, setFilterOptions] = React.useState({
    vendors: selectedFilters ? selectedFilters.vendors : [],
    modelNumbers: selectedFilters ? selectedFilters.modelNumbers : [],
    descriptions: selectedFilters ? selectedFilters.descriptions : [],
    categories: selectedFilters ? selectedFilters.categories : null,
  });
  history.listen((location, action) => {
    const urlVals = new URLSearchParams(location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    if ((action === 'PUSH' && lim === 25 && pg === 1) || action === 'POP') {
      // if user clicks on models nav link or goes back
      setInitLimit(lim);
      setInitPage(pg);
    }
  });
  const cellHandler = (e) => {
    if (e.field === 'view') {
      setModelNumber(e.row.modelNumber);
      setVendor(e.row.vendor);
      setId(e.row.id);
      setSerialNumber(e.row.serialNumber);
      setDescription(e.row.description);
      if (e.row.calibrationFrequency !== null) {
        setcalibrationFrequency(e.row.calibrationFrequency);
      }
    }
  };
  const genDaysLeft = (date) => {
    const today = new Date();
    const exp = new Date(date);
    return Math.round((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };
  const genClassName = (daysLeft) => {
    if (daysLeft > 30) {
      return 'text-success';
    }
    if (daysLeft > 0 && daysLeft <= 30) {
      return 'text-warning-theme';
    }
    return 'text-danger';
  };
  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
    },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 225 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    {
      field: 'comment',
      headerName: 'Comment',
      width: 400,
      hide: true,
      renderCell: (params) => (
        <div className="overflow-auto">{params.value}</div>
      ),
    },
    {
      field: 'recentCalDate',
      headerName: 'Calibration Date',
      width: 175,
      type: 'date',
    },
    {
      field: 'recentCalComment',
      headerName: 'Calibration Comment',
      width: 300,
      hide: true,
      renderCell: (params) => (
        <div className="overflow-auto">{params.value}</div>
      ),
    },
    {
      field: 'calibrationStatus',
      headerName: 'Calibration Expiration',
      width: 220,
      type: 'date',
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 'Out of Calibration' && (
              <MouseOverPopover
                className="mb-3"
                message="Instrument not calibrated!"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-emoji-angry-fill"
                  viewBox="0 0 16 16"
                >
                  {/* eslint-disable-next-line max-len */}
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 0 1 .166.76c.071.206.111.44.111.687C7 7.328 6.552 8 6 8s-1-.672-1-1.5c0-.408.109-.778.285-1.049l-1.009-.504a.5.5 0 0 1-.223-.67zm.232 8.157a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 1 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5 0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5z" />
                </svg>
              </MouseOverPopover>
            )}
            {params.value === 'N/A' ? (
              <MouseOverPopover
                className="mb-3"
                message="Instrument not calibratable"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </MouseOverPopover>
            ) : (
              params.value !== 'Out of Calibration' && (
                <MouseOverPopover
                  className="mb-3"
                  message={`${genDaysLeft(
                    params.value,
                  )} days left till next calibration`}
                >
                  <span className={genClassName(genDaysLeft(params.value))}>
                    {params.value}
                  </span>
                </MouseOverPopover>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View Instrument">
              <button
                type="button"
                className="btn "
                onClick={() => {
                  const state = { previousUrl: window.location.href };
                  history.push(
                    `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&serialNumber=${serialNumber}&description=${description}&id=${id}&calibrationFrequency=${calibrationFrequency}`,
                    state,
                  );
                }}
              >
                View
              </button>
            </MouseOverPopover>
          </div>
        </div>
      ), // TODO: put asset tag in url?
    },
  ];

  const filterRowForCSV = (exportRows) => {
    const filteredRows = exportRows.map((element) => ({
      vendor: element.vendor,
      modelNumber: element.modelNumber,
      serialNumber: element.serialNumber,
      comment: element.comment,
      calibrationDate: element.date,
      calibrationComment: element.calibrationComment,
    }));
    return filteredRows;
  };

  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'calibrationDate' },
    { label: 'Calibration-Comment', key: 'calibrationComment' },
  ];

  const onSearch = (vendors, modelNumbers, descriptions, categories) => {
    let actualCategories = [];
    categories?.forEach((element) => {
      actualCategories.push(element.name);
    });
    if (actualCategories.length === 0) {
      // if there's no elements in actualCategories, make it null
      actualCategories = null; // this is because an empty array will make fetch data return nothing
    }
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        categories: actualCategories,
      }),
      'ascii',
    ).toString('base64');
    // TODO: Maybe remove this query as it takes too long sometimes;
    Query({
      query: print(gql`
        query CountWithFilter(
          $vendor: String
          $modelNumber: String
          $description: String
          $instrumentCategories: [String]
        ) {
          countInstrumentsWithFilter(
            vendor: $vendor
            modelNumber: $modelNumber
            description: $description
            instrumentCategories: $instrumentCategories
          )
        }
      `),
      queryName: 'countInstrumentsWithFilter',
      getVariables: () => ({
        vendor: vendors[0]?.vendor,
        modelNumber: modelNumbers[0]?.modelNumber,
        description: descriptions[0]?.description,
        instrumentCategories: actualCategories,
      }),
      handleResponse: (response) => {
        setRowCount(response);
        if (
          vendors.length === 0
          && categories.length === 0
          && modelNumbers.length === 0
          && descriptions.length === 0
        ) {
          history.push(
            `/viewInstruments?page=1&limit=${initLimit}&count=${response}`,
          );
        } else {
          history.push(
            `/viewInstruments?page=1&limit=${initLimit}&count=${response}&filters=${filters}`,
          );
        }
      },
    });
    setFilterOptions({
      vendors,
      modelNumbers,
      descriptions,
      categories: actualCategories,
    });
  };
  const {
    vendors, modelNumbers, descriptions, categories,
  } = filterOptions;
  const filterDescription = descriptions[0]?.description;
  const filterModelNumber = modelNumbers[0]?.modelNumber;
  const filterVendor = vendors[0]?.vendor;
  const updateUrl = (page, limit) => {
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        categories,
      }),
      'ascii',
    ).toString('base64');
    let searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
    if (window.location.search.includes('filters')) {
      searchString = `?page=${page}&limit=${limit}&count=${rowCount}&filters=${filters}`;
    }
    if (window.location.search !== searchString) {
      // If current location != next location, update url
      history.push(`/viewInstruments${searchString}`);
      setInitLimit(limit);
      setInitPage(page);
    }
  };

  return (
    <>
      <ServerPaginationGrid
        rowCount={rowCount}
        cellHandler={cellHandler}
        headerElement={(
          <div className="d-flex justify-content-between py-2">
            {user.isAdmin && (
              <Link className="btn m-2 text-nowrap" to="/addInstrument">
                Create Instrument
              </Link>
            )}
            <SearchBar
              onSearch={onSearch}
              forModelSearch={false}
              initDescriptions={filterOptions.descriptions}
              initModelNumbers={filterOptions.modelNumbers}
              initVendors={filterOptions.vendors}
              initCategories={filterOptions.categories}
            />
          </div>
        )}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          updateUrl(page, limit);
        }}
        onPageSizeChange={(page, limit) => {
          updateUrl(page, limit);
        }}
        fetchData={(limit, offset) => GetAllInstruments({
          limit,
          offset,
          vendor: filterVendor,
          modelNumber: filterModelNumber,
          description: filterDescription,
          modelCategories: null,
          instrumentCategories: null,
          serialNumber: null,
          assetTag: null,
        }).then((response) => {
          response.forEach((element) => {
            if (element !== null) {
              element.calibrationStatus = element.calibrationFrequency !== null
                ? 'Out of Calibration'
                : 'N/A';
              element.recentCalDate = 'N/A';
              if (
                element.calibrationFrequency
                  && element.recentCalibration
                  && element.recentCalibration[0]
              ) {
                // eslint-disable-next-line prefer-destructuring
                element.calibrationStatus = new Date(
                  element.recentCalibration[0].date,
                )
                  .addDays(element.calibrationFrequency)
                  .toISOString()
                  .split('T')[0];
                element.recentCalDate = element.recentCalibration[0].date;
              }
            }
          });
          return response;
        })}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filename="instruments.csv"
      />
    </>
  );
}

/*
response.forEach((element) => {
            if (element !== null) {
              GetCalibHistory({
                // Get calibration history for each instrument
                id: element.id,
                mostRecent: true,
              }).then((value) => {
                element.date = element.calibrationFrequency === 0
                  ? 'Item not calibratable'
                  : 'Not calibrated';
                element.calibrationComment = value.comment;
                element.calibrationStatus = element.calibrationFrequency === 0
                  ? 'N/A'
                  : 'Out of Calibration';
                if (value) {
                  element.date = value.date;
                  const nextCalibDate = new Date(value.date)
                    .addDays(element.calibrationFrequency)
                    .toISOString()
                    .split('T')[0];
                  element.calibrationStatus = nextCalibDate;
                }
                delete element.calibrationFrequency;
              });
            }
          });
          new Date(element.recentCalibration.date)
                  .addDays(element.calibrationFrequency)
                  .toISOString()
                  .split('T')[0];
*/
