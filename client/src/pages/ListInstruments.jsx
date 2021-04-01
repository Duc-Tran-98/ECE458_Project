/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = useState(parseInt(urlParams.get('limit'), 10));
  const [orderBy, setOrderBy] = useState(urlParams.get('orderBy'));
  const [sortBy, setSortBy] = useState(urlParams.get('sortBy'));
  let urlFilter = urlParams.get('filters');
  let selectedFilters = null;
  if (urlFilter) {
    selectedFilters = JSON.parse(
      Buffer.from(urlFilter, 'base64').toString('ascii'),
    );
  }
  const [update, setUpdate] = React.useState(false);
  const [filterOptions, setFilterOptions] = React.useState({
    vendors: selectedFilters ? selectedFilters.vendors : null,
    modelNumbers: selectedFilters ? selectedFilters.modelNumbers : null,
    descriptions: selectedFilters ? selectedFilters.descriptions : null,
    modelCategories: selectedFilters ? selectedFilters.modelCategories : null,
    instrumentCategories: selectedFilters ? selectedFilters.instrumentCategories : null,
    filterSerialNumber: selectedFilters ? selectedFilters.filterSerialNumber : null,
    assetTag: selectedFilters ? selectedFilters.assetTag : null,
  });
  const getAndSetUrlVals = (search) => {
    const urlVals = new URLSearchParams(search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    const order = urlVals.get('orderBy');
    const sort = urlVals.get('sortBy');
    urlFilter = urlVals.get('filters');
    setInitLimit(lim);
    setInitPage(pg);
    setOrderBy(order);
    setSortBy(sort);
    if (urlFilter) {
      selectedFilters = JSON.parse(Buffer.from(urlFilter, 'base64').toString('ascii'));
    } else {
      selectedFilters = null;
    }
    setFilterOptions({
      vendors: selectedFilters ? selectedFilters.vendors : null,
      modelNumbers: selectedFilters ? selectedFilters.modelNumbers : null,
      descriptions: selectedFilters ? selectedFilters.descriptions : null,
      modelCategories: selectedFilters ? selectedFilters.modelCategories : null,
      instrumentCategories: selectedFilters
        ? selectedFilters.instrumentCategories
        : null,
      filterSerialNumber: selectedFilters
        ? selectedFilters.filterSerialNumber
        : null,
      assetTag: selectedFilters ? selectedFilters.assetTag : null,
    });
  };
  // eslint-disable-next-line no-unused-vars
  history.listen((location, action) => {
    let active = true;
    (async () => {
      if (!active) return;
      getAndSetUrlVals(location.search);
    })();
    return () => {
      active = false;
    };
  });
  const cellHandler = (e) => {
    const state = { previousUrl: window.location.href };
    const {
      modelNumber, vendor, assetTag,
    } = e.row;
    history.push(
      `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&assetTag=${assetTag}`,
      state,
    );
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
  const generateCalibrationMessage = (date) => {
    const daysLeft = genDaysLeft(date);
    if (daysLeft === 0) { return 'Calibration due today!'; }
    if (daysLeft === 1) { return 'Calibration due tomorrow!'; }
    if (daysLeft < 0) { return `Calibration EXPIRED ${daysLeft * -1} days ago!`; }
    return `Calibration due in ${daysLeft} days.`;
  };
  const categoriesList = (categories) => {
    const catArr = [];
    categories.value.forEach((element) => {
      catArr.push(element.name);
    });
    return catArr.join(', ');
    // return (<TagsInput tags={catArr} dis />);
  };
  const headerClass = 'customMuiHeader';
  const cols = [
    {
      field: 'vendor',
      headerName: 'Vendor',
      width: 120,
      description: 'Vendor',
      headerClassName: headerClass,
    },
    {
      field: 'modelNumber',
      headerName: 'Model Number',
      width: 170,
      description: 'Model Number',
      headerClassName: headerClass,
    },
    {
      field: 'assetTag',
      headerName: 'Asset Tag',
      width: 140,
      description: 'Asset Tag',
      headerClassName: headerClass,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 225,
      description: 'Description',
    },
    {
      field: 'serialNumber',
      headerName: 'Serial Number',
      width: 150,
      description: 'Serial Number',
    },
    {
      field: 'categories',
      headerName: 'Categories',
      description: 'Categories',
      headerClassName: headerClass,
      width: 255,
      sortable: false,
      renderCell: (params) => (
        <p
          className="text-wrap"
          style={{ fontSize: '0.79em', lineHeight: '1.1' }}
        >
          {categoriesList(params)}
        </p>
      ),
    },
    {
      field: 'comment',
      headerName: 'Comment',
      description: 'Comment',
      width: 400,
      hide: true,
      renderCell: (params) => (
        <div className="overflow-auto">{params.value}</div>
      ),
    },
    {
      field: 'recentCalDate',
      headerName: 'Calib Date',
      description: 'Calibration Date',
      width: 140,
      sortable: false,
      type: 'date',
    },
    {
      field: 'recentCalComment',
      headerName: 'Calibration Comment',
      description: 'Calibration Comment',
      width: 300,
      hide: true,
      sortable: false,
      renderCell: (params) => (
        <div className="overflow-auto">{params.value}</div>
      ),
    },
    {
      field: 'calibrationStatus',
      headerName: 'Calib Exp',
      description: 'Calibration Expiration',
      width: 120,
      sortable: false,
      type: 'date',
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 'Out of Calibration' && (
              <MouseOverPopover
                className="mb-3 ps-2"
                message="Instrument not calibrated!"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="red"
                  className="bi bi-exclamation-diamond-fill"
                  viewBox="0 0 16 16"
                >
                  {/* eslint-disable-next-line max-len */}
                  <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
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
                  message={generateCalibrationMessage(params.value)}
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
  ];

  const filterRowForCSV = (exportRows) => {
    const filteredRows = exportRows.map((element) => ({
      vendor: element.vendor,
      modelNumber: element.modelNumber,
      assetTag: element.assetTag,
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
    { label: 'Asset-Tag', key: 'assetTag' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'calibrationDate' },
    { label: 'Calibration-Comment', key: 'calibrationComment' },
  ];

  const updateUrlWithFilter = ({
    vendors, modelNumbers, descriptions, modelCategories, instrumentCategories, filterSerialNumber, assetTag,
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
        filterSerialNumber,
        assetTag,
      }),
      'ascii',
    ).toString('base64');
    let route = '';
    if (
      (!vendors)
      && (modelCategories === null || modelCategories?.length === 0)
      && (instrumentCategories === null || instrumentCategories?.length === 0)
      && (!modelNumbers)
      && (!descriptions)
      && (!filterSerialNumber)
      && (!assetTag)
    ) {
      route = `/viewInstruments?page=1&limit=${initLimit}&orderBy=${orderBy}&sortBy=${sortBy}`;
      history.push(route);
    } else {
      route = `/viewInstruments?page=1&limit=${initLimit}&orderBy=${orderBy}&sortBy=${sortBy}&filters=${filters}`;
      history.push(route);
    }
  };

  const onSearch = ({
    vendors, modelNumbers, descriptions, modelCategories, instrumentCategories, filterSerialNumber, assetTag,
  }) => {
    let formatedModelCategories = [];
    let formatedInstrumentCategories = [];
    modelCategories?.forEach((element) => {
      formatedModelCategories.push(element.name);
    });
    instrumentCategories?.forEach((element) => {
      formatedInstrumentCategories.push(element.name);
    });
    formatedInstrumentCategories = formatedInstrumentCategories.length > 0 ? formatedInstrumentCategories : null;
    formatedModelCategories = formatedModelCategories.length > 0 ? formatedModelCategories : null;
    updateUrlWithFilter({
      vendors,
      modelNumbers,
      descriptions,
      modelCategories: formatedModelCategories,
      instrumentCategories: formatedInstrumentCategories,
      filterSerialNumber,
      assetTag,
    });
  };

  const {
    vendors, modelNumbers, descriptions, modelCategories, instrumentCategories, filterSerialNumber, assetTag,
  } = filterOptions;

  const updateUrlOnPageChange = (page, limit) => {
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        modelCategories,
        instrumentCategories,
        filterSerialNumber,
        assetTag,
      }),
      'ascii',
    ).toString('base64');
    let searchString = `?page=${page}&limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}`;
    if (window.location.search.includes('filters')) {
      searchString = `?page=${page}&limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}&filters=${filters}`;
    }
    if (window.location.search !== searchString) {
      // If current location != next location, update url
      history.push(`/viewInstruments${searchString}`);
    }
  };

  const updateUrlOnOrderChange = (order, sort) => { // this is passed to the on page change and on page size change
    // handlers of the server pagination grid
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        modelCategories,
        instrumentCategories,
        filterSerialNumber,
        assetTag,
      }),
      'ascii',
    ).toString('base64');
    let searchString = `?page=${initPage}&limit=${initLimit}&orderBy=${order}&sortBy=${sort}`;
    if (window.location.search.includes('filters')) {
      searchString = `?page=${initPage}&limit=${initLimit}&orderBy=${order}&sortBy=${sort}&filters=${filters}`;
    }
    if (window.location.search !== searchString) {
      // If current location != next location, update url
      history.push(`/viewInstruments${searchString}`);
    }
  };

  return (
    <>
      <ServerPaginationGrid
        rowCount={() => GetAllInstruments({
          limit: 1,
          offset: 0,
          modelNumber: modelNumbers,
          description: descriptions,
          vendor: vendors,
          modelCategories,
          instrumentCategories,
          serialNumber: filterSerialNumber,
          assetTag,
          fetchPolicy: 'no-cache',
        }).then((response) => response.total)}
        cellHandler={cellHandler}
        headerElement={(
          <div className="d-flex justify-content-between py-2">
            {/* {(user.isAdmin || user.instrumentPermission) && (
              createBtn
            )} */}
            <SearchBar
              onSearch={onSearch}
              forModelSearch={false}
              initDescriptions={filterOptions.descriptions}
              initModelNumbers={filterOptions.modelNumbers}
              initVendors={filterOptions.vendors}
              initModelCategories={filterOptions.modelCategories}
              initInstrumentCategories={filterOptions.instrumentCategories}
              initSerialNumber={filterOptions.filterSerialNumber}
              initAssetTag={filterOptions.assetTag}
            />
          </div>
        )}
        shouldUpdate={update}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          updateUrlOnPageChange(page, limit);
        }}
        onPageSizeChange={(page, limit) => {
          updateUrlOnPageChange(page, limit);
        }}
        initialOrder={() => {
          if (orderBy) {
            return [[orderBy, sortBy]];
          }
          return null;
        }}
        onSortModelChange={(order, sort) => {
          updateUrlOnOrderChange(order, sort);
        }}
        fetchData={(limit, offset, ordering) => GetAllInstruments({
          limit,
          offset,
          vendor: vendors,
          modelNumber: modelNumbers,
          description: descriptions,
          modelCategories,
          instrumentCategories,
          serialNumber: filterSerialNumber,
          assetTag,
          orderBy: ordering,
        }).then((response) => {
          if (response !== null) {
            const copyOfRes = JSON.parse(JSON.stringify(response)); // make deep copy of response b/c cannot add new properties to response
            copyOfRes.instruments.forEach((element) => {
              if (element !== null) {
                element.categories = element.modelCategories.concat(element.instrumentCategories);
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
            return copyOfRes.instruments;
          }
          return [];
        })}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filterOptions={filterOptions}
        filename="instruments.csv"
        showToolBar
        showImport={(user.isAdmin || user.instrumentPermission)}
        onCreate={() => {
          setUpdate(true);
          setUpdate(false);
        }}
      />
    </>
  );
}
