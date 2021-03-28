/*
This class is for the table view of models
*/
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import MouseOverPopover from '../components/PopOver';
import SearchBar from '../components/SearchBar';
import UserContext from '../components/UserContext';

function ListModels() {
  const history = useHistory();
  const user = React.useContext(UserContext);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = useState(parseInt(urlParams.get('limit'), 10));
  const [update, setUpdate] = useState(false);
  let urlFilter = urlParams.get('filters');
  let selectedFilters = null;
  if (urlFilter) {
    selectedFilters = JSON.parse(Buffer.from(urlFilter, 'base64').toString('ascii'));
  }
  const [filterOptions, setFilterOptions] = React.useState({
    vendors: selectedFilters ? selectedFilters.vendors : null,
    modelNumbers: selectedFilters ? selectedFilters.modelNumbers : null,
    descriptions: selectedFilters ? selectedFilters.descriptions : null,
    categories: selectedFilters ? selectedFilters.categories : null,
  });
  const getAndSetUrlVals = (search = null) => {
    const urlVals = new URLSearchParams(search || window.location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    urlFilter = urlVals.get('filters');
    setInitLimit(lim);
    setInitPage(pg);
    if (urlFilter) {
      selectedFilters = JSON.parse(Buffer.from(urlFilter, 'base64').toString('ascii'));
    } else {
      selectedFilters = null;
    }
    setFilterOptions({
      vendors: selectedFilters ? selectedFilters.vendors : null,
      modelNumbers: selectedFilters ? selectedFilters.modelNumbers : null,
      descriptions: selectedFilters ? selectedFilters.descriptions : null,
      categories: selectedFilters ? selectedFilters.categories : null,
    });
  };
  // eslint-disable-next-line no-unused-vars
  history.listen((location, action) => {
    let active = true;
    (async () => {
      if (!active) return;
      getAndSetUrlVals(location.search); // if history.push/replace or pop happens, update our state
      // based on the search params
    })();
    return () => { active = false; };
  });

  const cellHandler = (e) => {
    const state = { previousUrl: window.location.href };
    const { modelNumber, vendor } = e.row;
    history.push(
      `/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}`,
      state,
    );
  };
  const categoriesList = (categories) => {
    const catArr = [];
    categories.value.forEach((element) => {
      catArr.push(element.name);
    });
    return catArr.join(', ');
  };
  const cols = [
    {
      field: 'vendor',
      headerName: 'Vendor',
      width: 150,
      description: 'Vendor',
    },
    {
      field: 'modelNumber',
      headerName: 'Model Number',
      width: 150,
      description: 'Model Number',
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 350,
      description: 'Description',
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
      field: 'calibrationFrequency',
      headerName: 'Calib Freq',
      description: 'Calibration Frequency',
      width: 120,
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 0 || params.value === null ? (
              <MouseOverPopover message="Model not calibratable">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 32 32"
                >
                  {/* eslint-disable-next-line max-len */}
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                  {/* eslint-disable-next-line max-len */}
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </MouseOverPopover>
            ) : (
              params.value
            )}
          </div>
        </div>
      ),
    },
    {
      field: 'categories',
      headerName: 'Categories',
      description: 'Categories',
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <div className="overflow-auto">{categoriesList(params)}</div>
      ),
    },
  ];

  // Pass into UITable
  const filterRowForCSV = (exportRows) => {
    const filteredRows = exportRows.map((element) => ({
      vendor: element.vendor,
      modelNumber: element.modelNumber,
      description: element.description,
      comment: element.comment,
      calibrationFrequency: element.calibrationFrequency,
    }));
    return filteredRows;
  };

  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Short-Description', key: 'description' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Frequency', key: 'calibrationFrequency' },
  ];

  const updateUrlWithFilter = ({ // this method called onSearch to handle url manipulation
    vendors,
    modelNumbers,
    descriptions,
    categories,
  }) => {
    const actualCategories = categories !== null ? categories : null;
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        categories: actualCategories,
      }),
      'ascii',
    ).toString('base64');
    let route = '';
    if (
      (!vendors)
      && (categories === null || categories?.length === 0)
      && (!modelNumbers)
      && (!descriptions)
    ) {
      route = `/viewModels?page=1&limit=${initLimit}`;
      history.push(route);
    } else {
      route = `/viewModels?page=1&limit=${initLimit}&filters=${filters}`;
      history.push(
        route,
      );
    }
  };

  const onSearch = ({
    vendors, modelNumbers, descriptions, modelCategories,
  }) => {
    let actualCategories = [];
    modelCategories?.forEach((element) => {
      actualCategories.push(element.name);
    });
    actualCategories = actualCategories.length > 0 ? actualCategories : null;
    updateUrlWithFilter({
      vendors,
      modelNumbers,
      descriptions,
      categories: actualCategories,
    });
  };

  const {
    vendors, modelNumbers, descriptions, categories,
  } = filterOptions;

  const updateUrl = (page, limit) => { // this is passed to the on page change and on page size change
    // handlers of the server pagination grid
    const filters = Buffer.from(
      JSON.stringify({
        vendors,
        modelNumbers,
        descriptions,
        categories,
      }),
      'ascii',
    ).toString('base64');
    let searchString = `?page=${page}&limit=${limit}`;
    if (window.location.search.includes('filters')) {
      searchString = `?page=${page}&limit=${limit}&filters=${filters}`;
    }
    if (window.location.search !== searchString) {
      // If current location != next location, update url
      history.push(`/viewModels${searchString}`);
    }
  };

  return (
    <>
      <ServerPaginationGrid
        rowCount={() => GetAllModels({
          limit: 1,
          offset: 0,
          modelNumber: modelNumbers,
          description: descriptions,
          vendor: vendors,
          categories,
          fetchPolicy: 'no-cache',
        }).then((response) => response.total)}
        cellHandler={cellHandler}
        headerElement={(
          <div className="d-flex justify-content-between py-2">
            {/* {(user.isAdmin || user.modelPermission) && (
              createBtn
            )} */}
            <SearchBar
              forModelSearch
              onSearch={onSearch}
              initModelCategories={filterOptions.categories}
              initDescriptions={filterOptions.descriptions}
              initModelNumbers={filterOptions.modelNumbers}
              initVendors={filterOptions.vendors}
            />
          </div>
        )}
        shouldUpdate={update}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          updateUrl(page, limit);
        }}
        onPageSizeChange={(page, limit) => {
          updateUrl(page, limit);
        }}
        fetchData={(limit, offset, orderBy) => GetAllModels({
          limit,
          offset,
          vendor: vendors,
          modelNumber: modelNumbers,
          description: descriptions,
          categories,
          orderBy,
        }).then((response) => response.models)}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filename="models.csv"
        filterOptions={filterOptions}
        showToolBar
        showImport={(user.isAdmin || user.modelPermission)}
        onCreate={() => {
          setUpdate(true);
          setUpdate(false);
        }}

      />
    </>
  );
}
export default ListModels;
