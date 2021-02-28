/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useHistory } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import MouseOverPopover from '../components/PopOver';
import GetModelCategories, { CountModelCategories } from '../queries/GetModelCategories';
import GetInstrumentCategories, { CountInstrumentCategories } from '../queries/GetInstrumentCategories';

import { GetAllUsers } from '../queries/GetUser';

function ManageCategories() {
  const history = useHistory();
  const queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let startTab;
  if (window.location.pathname.startsWith('/model')) {
    startTab = 'model';
  } else {
    startTab = 'instrument';
  }
  const [key, setKey] = useState(startTab);
  const [rowCount, setRowCount] = React.useState(parseInt(urlParams.get('count'), 10));
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
      headerName: 'Category',
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
            <MouseOverPopover message="Edit category">
              <button
                type="button"
                className="btn"
                onClick={() => {
                //   const state = { previousUrl: window.location.href };
                //   history.push(
                //     `/viewUser/?userName=${userName}&isAdmin=${isAdmin}`,
                //     state,
                //   );
                  console.log('edit cat');
                }}
              >
                Edit
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
            <MouseOverPopover message="Delete category">
              <button
                type="button"
                className="btn"
                onClick={() => {
                //   const state = { previousUrl: window.location.href };
                //   history.push(
                //     `/viewUser/?userName=${userName}&isAdmin=${isAdmin}`,
                //     state,
                //   );
                  console.log('delete cat');
                }}
              >
                Delete
              </button>
            </MouseOverPopover>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <Tabs
        id="tabs"
        activeKey={key}
        onSelect={async (k) => {
          let rows;
          if (k === 'model') {
            await CountModelCategories().then((val) => {
              setRowCount(val);
              rows = val;
            });
          } else {
            await CountInstrumentCategories().then((val) => {
              setRowCount(val);
              rows = val;
            });
          }
          setKey(k);
          const searchString = `?page=${1}&limit=${25}&count=${rows}`;
          // if (window.location.search !== searchString) {
          // If current location != next location, update url
          history.push(`/${k}Categories${searchString}`);
          setInitLimit(25);
          setInitPage(1);
          // }
        }}
        unmountOnExit
      >
        <Tab eventKey="model" title="Model Categories">
          <ServerPaginationGrid
            rowCount={rowCount}
            cellHandler={(e) => {
              // if (e.field === 'view') {
              //   setUserName(e.row.userName);
              //   setIsAdmin(e.row.isAdmin);
              // }
            }}
            headerElement={(
              <Link className="btn  m-2" to="/addUser">
                Create Model Category
              </Link>
            )}
            cols={cols}
            initPage={initPage}
            initLimit={initLimit}
            onPageChange={(page, limit) => {
              const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
              if (window.location.search !== searchString) {
                // If current location != next location, update url
                history.push(`/modelCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            onPageSizeChange={(page, limit) => {
              const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
              if (window.location.search !== searchString) {
                // If current location != next location, update url
                history.push(`/modelCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            fetchData={(limit, offset) => GetModelCategories({ limit, offset }).then((response) => response)}
          />
        </Tab>
        <Tab eventKey="instrument" title="Instrument Categories">
          <ServerPaginationGrid
            rowCount={rowCount}
            cellHandler={(e) => {
            // if (e.field === 'view') {
            //   setUserName(e.row.userName);
            //   setIsAdmin(e.row.isAdmin);
            // }
            }}
            headerElement={(
              <Link className="btn  m-2" to="/addUser">
                Create Instrument Category
              </Link>
            )}
            cols={cols}
            initPage={initPage}
            initLimit={initLimit}
            onPageChange={(page, limit) => {
              const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
              if (window.location.search !== searchString) {
              // If current location != next location, update url
                history.push(`/instrumentCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            onPageSizeChange={(page, limit) => {
              const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
              if (window.location.search !== searchString) {
              // If current location != next location, update url
                history.push(`/instrumentCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            fetchData={(limit, offset) => GetInstrumentCategories({ limit, offset }).then((response) => response)}
          />
        </Tab>
      </Tabs>

    </>
  );
}

export default ManageCategories;
