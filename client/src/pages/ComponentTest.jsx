/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import OAuth from '../components/OAuthLogin';
import ToastTest from '../components/ToastTest';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import AsyncSuggest from '../components/AsyncSuggest';

const GET_MODELS_QUERY = gql`
  query Models {
    getAllModels {
      modelNumber
      vendor
      calibrationFrequency
      description
    }
  }
`;
const query = print(GET_MODELS_QUERY);
const queryName = 'getAllModels';

export default function ComponentTest() {
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
        <div className="overflow-auto">{params.value}</div>
      ),
    },
    {
      field: 'calibrationFrequency',
      headerName: 'Calibration Frequency',
      width: 195,
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 0 || params.value === null ? (
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
            <button
              type="button"
              className="btn "
              onClick={() => undefined}
            >
              View
            </button>
          </div>
        </div>
      ),
    },
  ];
  const formatOption = (option) => `${option.vendor} ${option.modelNumber}`;
  const formatSelected = (option, value) => option.modelNumber === value.modelNumber && option.vendor === value.vendor;
  return (
    <>
      <ToastTest />
      <OAuth />
      <ServerPaginationGrid
        rowCount={64}
        cellHandler={() => undefined}
        headerElement={(
          <div className="d-flex flex-row">
            <Link className="btn  m-2" to="/addModel">
              Create Model
            </Link>
            <div className="mx-2 my-2">
              <Form.Group>
                <Form.Label className="h4 ">Vendors</Form.Label>
                <AsyncSuggest
                  query={query}
                  queryName={queryName}
                  onInputChange={(_e, v) => console.log(v)}
                  label="Filter by Vendors"
                  getOptionSelected={formatSelected}
                  getOptionLabel={formatOption}
                  multiple
                />
              </Form.Group>
            </div>
          </div>
        )}
        cols={cols}
        initPage={1}
        initLimit={100}
        // eslint-disable-next-line no-unused-vars
        onPageChange={(page, limit) => undefined}
        // eslint-disable-next-line no-unused-vars
        onPageSizeChange={(page, limit) => undefined}
        fetchData={(limit, offset) => GetAllModels({ limit, offset }).then((response) => response)}
      />
    </>
  );
}
