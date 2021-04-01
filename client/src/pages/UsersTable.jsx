import React from 'react';
import { useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import { GetAllUsers, CountAllUsers } from '../queries/GetUser';
import CreateUser from './CreateUser';
import ModalAlert, { StateLessModal } from '../components/ModalAlert';
import ViewUser from './ViewUser';
// import MouseOverPopover from '../components/PopOver';

export default function UsersTable() {
  const history = useHistory();
  const queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');
  const [orderBy, setOrderBy] = React.useState(urlParams.get('orderBy'));
  const [sortBy, setSortBy] = React.useState(urlParams.get('sortBy'));
  const [update, setUpdate] = React.useState(false);
  history.listen((location, action) => {
    urlParams = new URLSearchParams(location.search);
    const lim = parseInt(urlParams.get('limit'), 10);
    const pg = parseInt(urlParams.get('page'), 10);
    const order = urlParams.get('orderBy');
    const sort = urlParams.get('sortBy');
    setOrderBy(order);
    setSortBy(sort);
    if ((action === 'PUSH' && lim === 25 && pg === 1) || action === 'POP') {
      // if user clicks on models nav link or goes back
      setInitLimit(lim);
      setInitPage(pg);
    }
  });
  const showTableBoolean = (params) => (params.value ? (
    <div className="position-relative w-50 h-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="MediumSeaGreen"
        className="bi bi-check-circle-fill position-absolute top-50 start-50 translate-middle"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
    </div>
  ) : (
    <div className="position-relative w-50 h-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="tomato"
        className="bi bi-x-circle-fill position-absolute top-50 start-50 translate-middle"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
      </svg>
    </div>
  ));
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
      width: 120,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'modelPermission',
      headerName: 'Model Perm',
      description: 'Model Permission',
      width: 120,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'instrumentPermission',
      headerName: 'Inst Perm',
      description: 'Instrument Permission',
      width: 120,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'calibrationPermission',
      headerName: 'Calib Perm',
      description: 'Calibration Permission',
      width: 120,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'calibrationApproverPermission',
      headerName: 'Approver?',
      description: 'Calibration Approver Permission',
      width: 120,
      headerClassName: headerClass,
      renderCell: (params) => showTableBoolean(params),
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
      <StateLessModal
        width=""
        title={`You are viewing user: ${selectedUser}`}
        handleClose={() => {
          setShowEdit(false);
        }}
        show={showEdit}
      >
        <ViewUser userName={selectedUser} onDelete={() => { setShowEdit(false); setSelectedUser(''); }} />
      </StateLessModal>
      <ServerPaginationGrid
        rowCount={() => CountAllUsers().then((val) => val)}
        cellHandler={(e) => {
          // const state = { previousUrl: window.location.href };
          // history.push(
          //   `/viewUser/?userName=${e.row.userName}`,
          //   state,
          // );
          setSelectedUser(e.row.userName);
          setShowEdit(true);
        }}
        shouldUpdate={update}
        headerElement={(
          createBtn
        )}
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        onPageChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        onPageSizeChange={(page, limit) => {
          const searchString = `?page=${page}&limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
            setInitLimit(limit);
            setInitPage(page);
          }
        }}
        initialOrder={() => {
          if (orderBy) {
            return [[orderBy, sortBy]];
          }
          return null;
        }}
        onSortModelChange={(order, sort) => {
          const searchString = `?page=${initPage}&limit=${initLimit}&orderBy=${order}&sortBy=${sort}`;
          if (window.location.search !== searchString) {
            // If current location != next location, update url
            history.push(`/viewUsers${searchString}`);
          }
        }}
        fetchData={(limit, offset, ordering) => GetAllUsers({
          limit,
          offset,
          orderBy: ordering,
        }).then((response) => response)}
        showToolBar={false}
        showImport={false}
      />
    </>
  );
}
