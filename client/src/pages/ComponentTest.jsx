/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import SearchBar from '../components/SearchBar';

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
  const [filterOptions, setFilterOptions] = React.useState({
    vendors: [],
    modelNumbers: [],
    descriptions: [],
    categories: null,
  });
  const onSearch = (vendors, modelNumbers, descriptions, categories) => {
    let actualCategories = [];
    categories.forEach((element) => {
      actualCategories.push(element.name);
    });
    if (actualCategories.length === 0) { // if there's no elements in actualCategories, make it null
      actualCategories = null;// this is because an empty array will make fetch data return nothing
    }
    setFilterOptions({
      vendors,
      modelNumbers,
      descriptions,
      categories: actualCategories,
    });
  };
  const onClearFilters = () => {
    setFilterOptions({
      vendors: [],
      modelNumbers: [],
      descriptions: [],
      categories: null,
    });
  };
  const {
    vendors, modelNumbers, descriptions, categories,
  } = filterOptions;
  const description = descriptions[0]?.description;
  const modelNumber = modelNumbers[0]?.modelNumber;
  const vendor = vendors[0]?.vendor;
  console.log(vendor, modelNumber, description);
  return (
    // <>
    //   <ServerPaginationGrid
    //     rowCount={64}
    //     cellHandler={() => undefined}
    //     headerElement={(
    //       <div className="d-flex justify-content-between">
    //         <div className="p-2">
    //           <Link className="btn m-2 my-auto text-nowrap" to="/addModel">
    //             Create Model
    //           </Link>
    //         </div>
    //         <SearchBar
    //           forModelSearch
    //           onSearch={onSearch}
    //           onClearFilters={onClearFilters}
    //         />
    //       </div>
    //     )}
    //     cols={cols}
    //     initPage={1}
    //     initLimit={100}
    //     // eslint-disable-next-line no-unused-vars
    //     onPageChange={(page, limit) => undefined}
    //     // eslint-disable-next-line no-unused-vars
    //     onPageSizeChange={(page, limit) => undefined}
    //     fetchData={(limit, offset) => GetAllModels({
    //       limit,
    //       offset,
    //       vendor,
    //       modelNumber,
    //       description,
    //       categories,
    //     }).then((response) => response)}
    //   />
    // </>
    <>
      <div>Hello World</div>
      <a href="data/1615011409187-rainbowrow2.jpg" download="a.jpg">Click to download</a>
    </>
  );
}
