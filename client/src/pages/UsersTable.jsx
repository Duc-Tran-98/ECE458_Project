import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { ServerPaginationGrid } from '../components/UITable';
import { GetAllUsers, CountAllUsers } from '../queries/GetUser';
// import MouseOverPopover from '../components/PopOver';

export default function UsersTable() {
  const history = useHistory();
  const queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
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
  // FIXME: Style icon in center, currently div does nothing...
  const showTableBoolean = (params) => (params.value ? <div className="text-center"><CheckCircleIcon /></div> : <div> </div>);
  const headerClass = 'customMuiHeader';
  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
      headerClassName: headerClass,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
      headerClassName: headerClass,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 200,
      headerClassName: headerClass,
    },
    {
      field: 'userName',
      headerName: 'User Name',
      width: 200,
      headerClassName: headerClass,
    },
    {
      field: 'isAdmin',
      headerName: 'Admin',
      width: 140,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'modelPermission',
      headerName: 'Model Perm',
      description: 'Model Permission',
      width: 140,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'instrumentPermission',
      headerName: 'Inst Perm',
      description: 'Instrument Permission',
      width: 140,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'calibrationPermission',
      headerName: 'Calib Perm',
      description: 'Calibration Permission',
      width: 140,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
  ];
  return (
    <>
      <ServerPaginationGrid
        rowCount={() => CountAllUsers().then((val) => val)}
        cellHandler={(e) => {
          const state = { previousUrl: window.location.href };
          history.push(
            `/viewUser/?userName=${e.row.userName}&isAdmin=${e.row.isAdmin}&modelPermission=${e.row.modelPermission}&instrumentPermission=${e.row.instrumentPermission}&calibrationPermission=${e.row.calibrationPermission}`,
            state,
          );
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
