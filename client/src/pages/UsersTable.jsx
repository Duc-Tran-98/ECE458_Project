import React from 'react';
import { useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import { GetAllUsers, CountAllUsers } from '../queries/GetUser';
import CreateUser from './CreateUser';
import ModalAlert from '../components/ModalAlert';

export default function UsersTable() {
  const history = useHistory();
  const queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
  const [update, setUpdate] = React.useState(false);
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
      width: 100,
    },
    {
      field: 'modelPermission',
      headerName: 'Model Permission',
      width: 175,
    },
    {
      field: 'instrumentPermission',
      headerName: 'Instrument Permission',
      width: 175,
    },
    {
      field: 'calibrationPermission',
      headerName: 'Calibration Permission',
      width: 180,
    },
  ];

  const createBtn = (
    <ModalAlert
      title="Create User"
      btnText="Create User"
      btnClass="btn m-2 text-nowrap"
    >
      <CreateUser onCreation={() => {
        setUpdate(true);
        setUpdate(false);
      }}
      />
    </ModalAlert>
  );
  return (
    <>
      <ServerPaginationGrid
        rowCount={() => CountAllUsers().then((val) => val)}
        cellHandler={(e) => {
          const state = { previousUrl: window.location.href };
          history.push(
            `/viewUser/?userName=${e.row.userName}`,
            state,
          );
        }}
        shouldUpdate={update}
        headerElement={(
          createBtn
        )}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        onPageSizeChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        fetchData={(limit, offset) => GetAllUsers({ limit, offset }).then((response) => response)}
        showToolBar={false}
        showImport={false}
      />
    </>
  );
}
