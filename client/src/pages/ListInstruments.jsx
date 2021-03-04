/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllInstruments from '../queries/GetAllInstruments';
import MouseOverPopover from '../components/PopOver';
import SearchBar from '../components/SearchBar';
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
    modelCategories: selectedFilters ? selectedFilters.modelCategories : null,
    instrumentCategories: selectedFilters ? selectedFilters.instrumentCategories : null,
  });
  const navLink = document.getElementById('instrumentNavLink');
  const getAndSetUrlVals = () => {
    const urlVals = new URLSearchParams(window.location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    const total = parseInt(urlVals.get('count'), 10);
    setInitLimit(lim);
    setInitPage(pg);
    // console.log(`total = ${total}`);
    setRowCount(total);
  };
  if (navLink !== null) {
    navLink.onclick = () => {
      // console.log('clicked');
      if (
        filterOptions.vendors.length !== 0
        || filterOptions.modelNumbers.length !== 0
        || filterOptions.descriptions.length !== 0
        || filterOptions.modelCategories !== null
        || filterOptions.instrumentCategories !== null
      ) {
        console.log('clearing filters');
        setFilterOptions({
          vendors: [],
          modelNumbers: [],
          descriptions: [],
          modelCategories: null,
          instrumentCategories: null,
        });
      }
      setTimeout(() => {
        getAndSetUrlVals();
      }, 50);
    };
  }
  console.log(navLink);
  history.listen((location, action) => {
    if (action === 'POP') {
      // if user clicks on models nav link or goes back
      getAndSetUrlVals();
      // console.log('popped!');
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

  const updateUrlWithFilter = ({
    vendors, modelNumbers, descriptions, modelCategories, instrumentCategories, total,
  }) => {
    const formatedInstrumentCategories = instrumentCategories !== null ? instrumentCategories : null;
    const formatedModelCategories = modelCategories !== null ? modelCategories : null;
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        instrumentCategories: formatedInstrumentCategories,
        modelCategories: formatedModelCategories,
      }),
      'ascii',
    ).toString('base64');
    if (
      vendors.length === 0
      && (modelCategories === null || modelCategories?.length === 0)
      && (instrumentCategories === null || instrumentCategories?.length === 0)
      && modelNumbers.length === 0
      && descriptions.length === 0
    ) {
      history.push(`/viewInstruments?page=1&limit=${initLimit}&count=${total}`);
    } else {
      history.push(
        `/viewInstruments?page=1&limit=${initLimit}&count=${total}&filters=${filters}`,
      );
    }
  };

  const onSearch = ({
    vendors, modelNumbers, descriptions, modelCategories, instrumentCategories,
  }) => {
    console.log('searching...');
    let formatedModelCategories = [];
    let formatedInstrumentCategories = [];
    modelCategories?.forEach((element) => {
      formatedModelCategories.push(element.name);
    });
    instrumentCategories?.forEach((element) => {
      formatedInstrumentCategories.push(element.name);
    });
    console.log(modelCategories);
    formatedInstrumentCategories = formatedInstrumentCategories.length > 0 ? formatedInstrumentCategories : null;
    formatedModelCategories = formatedModelCategories.length > 0 ? formatedModelCategories : null;
    GetAllInstruments({
      limit: 1,
      offset: 0,
      modelNumber: modelNumbers[0]?.modelNumber,
      description: descriptions[0]?.description,
      vendor: vendors[0]?.vendor,
      modelCategories: formatedModelCategories,
    }).then((response) => {
      setRowCount(response.total);
      setInitPage(1);
      updateUrlWithFilter({
        vendors,
        modelNumbers,
        descriptions,
        modelCategories: formatedModelCategories,
        instrumentCategories: formatedInstrumentCategories,
        total: response.total,
      });
    });
    setFilterOptions({
      vendors,
      modelNumbers,
      descriptions,
      modelCategories: formatedModelCategories,
      instrumentCategories: formatedInstrumentCategories,
    });
  };
  const {
    vendors, modelNumbers, descriptions, modelCategories, instrumentCategories,
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
        modelCategories,
        instrumentCategories,
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
              <Link className="btn m-2 my-auto text-nowrap" to="/addInstrument">
                Create Instrument
              </Link>
            )}
            <SearchBar
              onSearch={onSearch}
              forModelSearch={false}
              initDescriptions={filterOptions.descriptions}
              initModelNumbers={filterOptions.modelNumbers}
              initVendors={filterOptions.vendors}
              initModelCategories={filterOptions.modelCategories}
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
          modelCategories,
          instrumentCategories,
          serialNumber: null,
          assetTag: null,
        }).then((response) => {
          // console.log('fetched data');
          response.instruments.forEach((element) => {
            if (element !== null) {
              element.calibrationStatus = element.calibrationFrequency === null
                || element.calibrationFrequency === 0
                ? 'N/A'
                : 'Out of Calibration';
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
          return response.instruments;
        })}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filename="instruments.csv"
      />
    </>
  );
}
