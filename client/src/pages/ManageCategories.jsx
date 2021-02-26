/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import MouseOverPopover from '../components/PopOver';
import GetModelCategories from '../queries/GetModelCategories';

function ManageCategories() {
  const history = useHistory();
  const queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const rowCount = parseInt(urlParams.get('count'), 10);
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
  const [userName, setUserName] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);
  history.listen((location, action) => {
    urlParams = new URLSearchParams(location.search);
    const lim = parseInt(urlParams.get('limit'), 10);
    const pg = parseInt(urlParams.get('page'), 10);
    if ((action === 'PUSH' && lim === 25 && pg === 1) || action === 'POP') {
      // if user clicks on models nav link or goes back
      setInitLimit(lim);
      setInitPage(pg);
    }
  });

  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
    },
    {
      field: 'name',
      headerName: 'Category Name',
      width: 200,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="Edit Category">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  console.log('edit');
                }}
              >
                View
              </button>
            </MouseOverPopover>
          </div>
        </div>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="Delete Category">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  console.log('delete');
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
  const shouldExport = false;
  return (
    <>
      <ServerPaginationGrid
        rowCount={rowCount}
        cellHandler={(e) => {
          if (e.field === 'view') {
            setUserName(e.row.userName);
            setIsAdmin(e.row.isAdmin);
          }
        }}
        // headerElement={(
        //   <Link className="btn  m-2" to="/addUser">
        //     Create User
        //   </Link>
        // )}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/categories${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        onPageSizeChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/categories${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        fetchData={(limit, offset) => GetModelCategories({ limit, offset }).then((response) => response)}
      />
    </>
  );
}

export default ManageCategories;
