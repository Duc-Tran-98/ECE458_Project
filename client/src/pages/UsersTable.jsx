import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import { GetAllUsers } from '../queries/GetUser';
import MouseOverPopover from '../components/PopOver';

export default function UsersTable() {
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
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 200,
    },
    {
      field: 'userName',
      headerName: 'User Name',
      width: 200,
    },
    {
      field: 'isAdmin',
      headerName: 'Admin',
      width: 200,
    },
    {
      field: 'view',
      headerName: 'View',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View User">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const state = { previousUrl: window.location.href };
                  history.push(
                    `/viewUser/?userName=${userName}&isAdmin=${isAdmin}`,
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
        headerElement={(
          <Link className="btn  m-2" to="/addUser">
            Create User
          </Link>
        )}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        onPageSizeChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        fetchData={(limit, offset) => GetAllUsers({ limit, offset }).then((response) => response)}
        showToolBar={false}
      />
    </>
  );
}
