/*
This class is starting to get a bit complex, so may want
to refactor this into smaller components when possible;
minor feature that would be cool is spinners while the modal alert loads;
*/
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import MouseOverPopover from '../components/PopOver';
import SearchBar from '../components/SearchBar';
import Query from '../components/UseQuery';

function ListModels() {
  const history = useHistory();
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
  const [filterOptions, setFilterOptions] = React.useState({
    vendors: [],
    modelNumbers: [],
    descriptions: [],
    categories: null,
  });
  history.listen((location, action) => {
    const urlVals = new URLSearchParams(location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    if ((action === 'PUSH' && lim === 25 && pg === 1) || action === 'POP') { // if user clicks on models nav link or goes back
      setInitLimit(lim);
      setInitPage(pg);
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

  const onSearch = (vendors, modelNumbers, descriptions, categories) => {
    let actualCategories = [];
    categories.forEach((element) => {
      actualCategories.push(element.name);
    });
    if (actualCategories.length === 0) {
      // if there's no elements in actualCategories, make it null
      actualCategories = null; // this is because an empty array will make fetch data return nothing
    }
    Query({
      query: print(gql`
        query CountWithFilter(
          $vendor: String
          $modelNumber: String
          $description: String
          $categories: [String]
        ) {
          countModelsWithFilter(
            vendor: $vendor
            modelNumber: $modelNumber
            description: $description
            categories: $categories
          )
        }
      `),
      queryName: 'countModelsWithFilter',
      getVariables: () => ({
        vendor: vendors[0]?.vendor,
        modelNumber: modelNumbers[0]?.modelNumber,
        description: descriptions[0]?.description,
        categories: actualCategories,
      }),
      handleResponse: (response) => {
        setRowCount(response);
        history.push(`/viewModels?page=1&limit=${initLimit}&count=${response}`);
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

  return (
    <>
      <ServerPaginationGrid
        rowCount={rowCount}
        cellHandler={cellHandler}
        headerElement={(
          <div className="d-flex justify-content-between">
            <div className="p-2">
              <Link className="btn m-2 my-auto text-nowrap" to="/addModel">
                Create Model
              </Link>
            </div>
            <SearchBar
              forModelSearch
              onSearch={onSearch}
            />
          </div>
        )}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewModels${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        onPageSizeChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewModels${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        fetchData={(limit, offset) => GetAllModels({
          limit,
          offset,
          vendor: filterVendor,
          modelNumber: filterModelNumber,
          description: filterDescription,
          categories,
        }).then((response) => response)}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filename="models.csv"
      />
    </>
  );
}
export default ListModels;
