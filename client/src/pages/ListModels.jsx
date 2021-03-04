/*
This class is starting to get a bit complex, so may want
to refactor this into smaller components when possible;
minor feature that would be cool is spinners while the modal alert loads;
*/
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import MouseOverPopover from '../components/PopOver';
import SearchBar from '../components/SearchBar';
import UserContext from '../components/UserContext';

function ListModels() {
  const history = useHistory();
  const user = React.useContext(UserContext);
  const [modelNumber, setModelNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const initRowCount = parseInt(urlParams.get('count'), 10);
  // eslint-disable-next-line no-unused-vars
  const [rowCount, setRowCount] = useState(initRowCount);
  const [initPage, setInitPage] = useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = useState(parseInt(urlParams.get('limit'), 10));
  const urlFilter = urlParams.get('filters');
  let selectedFilters = null;
  if (urlFilter) {
    selectedFilters = JSON.parse(Buffer.from(urlFilter, 'base64').toString('ascii'));
    // console.log(selectedFilters);
  }
  const [filterOptions, setFilterOptions] = React.useState({
    vendors: selectedFilters ? selectedFilters.vendors : [],
    modelNumbers: selectedFilters ? selectedFilters.modelNumbers : [],
    descriptions: selectedFilters ? selectedFilters.descriptions : [],
    categories: selectedFilters ? selectedFilters.categories : null,
  });
  const navLink = document.getElementById('modelNavLink');
  const getAndSetUrlVals = () => {
    const urlVals = new URLSearchParams(window.location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    const total = parseInt(urlVals.get('count'), 10);
    setInitLimit(lim);
    setInitPage(pg);
    console.log(`total = ${total}`);
    setRowCount(total);
  };
  if (navLink !== null) {
    navLink.onclick = () => {
      console.log('clicked');
      if (
        filterOptions.vendors.length !== 0
        || filterOptions.modelNumbers.length !== 0
        || filterOptions.descriptions.length !== 0
        || filterOptions.categories !== null
      ) {
        console.log('clearing filters');
        setFilterOptions({
          vendors: [],
          modelNumbers: [],
          descriptions: [],
          categories: null,
        });
      }
      setTimeout(() => {
        getAndSetUrlVals();
      }, 50);
    };
  }
  history.listen((location, action) => {
    if (action === 'POP') {
      // if user clicks on models nav link or goes back
      getAndSetUrlVals();
      console.log('popped!');
    }
  });

  const cellHandler = (e) => {
    if (e.field === 'view') {
      setDescription(e.row.description);
      setModelNumber(e.row.modelNumber);
      setVendor(e.row.vendor);
    }
  };
  const cols = [
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 400 },
    {
      field: 'comment',
      headerName: 'Comment',
      width: 400,
      hide: true,
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    },
    {
      field: 'calibrationFrequency',
      headerName: 'Calibration Frequency',
      width: 195,
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {(params.value === 0 || params.value === null) ? (
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
      field: 'view',
      headerName: 'View',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View Model">
              <button
                type="button"
                className="btn "
                onClick={() => {
                  const state = { previousUrl: window.location.href };
                  history.push(
                    `/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}&description=${description}`,
                    state,
                  );
                }}
              >
                View
              </button>
            </MouseOverPopover>
          </div>
        </div>
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

  const updateUrlWithFilter = ({
    vendors,
    modelNumbers,
    descriptions,
    categories,
    total,
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
    if (
      vendors.length === 0
      && categories.length === 0
      && modelNumbers.length === 0
      && descriptions.length === 0
    ) {
      history.push(`/viewModels?page=1&limit=${initLimit}&count=${total}`);
    } else {
      history.push(
        `/viewModels?page=1&limit=${initLimit}&count=${total}&filters=${filters}`,
      );
    }
  };

  const onSearch = (vendors, modelNumbers, descriptions, categories) => {
    const actualCategories = categories !== null ? categories : null;
    GetAllModels({
      limit: 1,
      offset: 0,
      modelNumber: modelNumbers[0]?.modelNumber,
      description: descriptions[0]?.description,
      vendor: vendors[0]?.vendor,
    }).then((response) => {
      setRowCount(response.total);
      setInitPage(1);
      updateUrlWithFilter({
        vendors,
        modelNumbers,
        descriptions,
        categories: actualCategories,
        total: response.total,
      });
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
      history.push(`/viewModels${searchString}`);
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
              <Link className="btn m-2 my-auto text-nowrap" to="/addModel">
                Create Model
              </Link>
            )}
            <SearchBar
              forModelSearch
              onSearch={onSearch}
              initCategories={filterOptions.categories}
              initDescriptions={filterOptions.descriptions}
              initModelNumbers={filterOptions.modelNumbers}
              initVendors={filterOptions.vendors}
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
        fetchData={(limit, offset) => GetAllModels({
          limit,
          offset,
          vendor: filterVendor,
          modelNumber: filterModelNumber,
          description: filterDescription,
          categories: null,
        }).then((response) => response.models)}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filename="models.csv"
      />
    </>
  );
}
export default ListModels;
