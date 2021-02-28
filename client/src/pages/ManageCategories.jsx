/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */

import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useHistory } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels from '../queries/GetAllModels';
import ModalAlert from '../components/ModalAlert';
import MouseOverPopover from '../components/PopOver';
import GetModelCategories, { CountModelCategories } from '../queries/GetModelCategories';
import GetInstrumentCategories, { CountInstrumentCategories } from '../queries/GetInstrumentCategories';
import DeleteModelCategory from '../queries/DeleteModelCategory';
import DeleteInstrumentCategory from '../queries/DeleteInstrumentCategory';
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
  const [category, setCategory] = React.useState('');
  const [responseMsg, setResponseMsg] = React.useState('');
  const [responseStatus, setResponseStatus] = React.useState(true);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
  const cellHandler = (e) => {
    setCategory(e.row.name);
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
                  console.log('edit cat');
                  setShowEdit(true);
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
                  console.log('delete cat');
                  setShowDelete(true);
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
  const closeDeleteModal = () => {
    setResponseMsg('');
    setResponseStatus(false);
    setShowDelete(false);
    console.log('close');
  };
  const closeEditModal = () => {
    setResponseMsg('');
    setResponseStatus(false);
    setShowEdit(false);
    console.log('close');
  };
  const closeCreateModal = () => {
    setResponseMsg('');
    setResponseStatus(false);
    setShowCreate(false);
    console.log('close');
  };
  const handleResponse = (response) => {
    setResponseMsg(response.message);
    setResponseStatus(response.success);
    setLoading(false);
    console.log(response);
  };
  const handleDelete = () => {
    setLoading(true);
    console.log('delete');
    if (key === 'model') {
      DeleteModelCategory({ name: category, handleResponse });
    } else {
      DeleteInstrumentCategory({ name: category, handleResponse });
    }
  };
  const handleEdit = () => {
    setLoading(true);
    console.log('edit');
    if (key === 'model') {
      console.log('model');
    } else {
      console.log('inst');
    }
  };
  const handleCreate = () => {
    setLoading(true);
    console.log('edit');
    if (key === 'model') {
      console.log('model');
    } else {
      console.log('inst');
    }
  };

  return (
    <>
      <ModalAlert
        show={showDelete}
        handleClose={closeDeleteModal}
        title="DELETE CATEGORY"
      >
        <>
          {responseMsg.length === 0 && (
            <div className="h4 text-center my-3">{`You are about to delete category ${category}. Are you sure?`}</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h4">{responseMsg}</div>
            ) : (
              <>
                <div className="mt-3">
                  <button className="btn " type="button" onClick={handleDelete}>
                    Yes
                  </button>
                </div>
                <span className="mx-3" />
                <div className="mt-3">
                  <button className="btn " type="button" onClick={closeDeleteModal}>
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      </ModalAlert>
      <ModalAlert
        show={showEdit}
        handleClose={closeEditModal}
        title="EDIT CATEGORY"
      >
        <>
          {responseMsg.length === 0 && (
            <div className="h4 text-center my-3">{`Change name of category: ${category}`}</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h4">{responseMsg}</div>
            ) : (
              <>
                <input />
                <span className="mx-3" />
                <div className="mt-3">
                  <button className="btn " type="button" onClick={handleEdit}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      </ModalAlert>
      <ModalAlert
        show={showCreate}
        handleClose={closeCreateModal}
        title="ADD CATEGORY"
      >
        <>
          {responseMsg.length === 0 && (
            <div className="h4 text-center my-3">Create new category</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h4">{responseMsg}</div>
            ) : (
              <>
                <input />
                <span className="mx-3" />
                <div className="mt-3">
                  <button className="btn " type="button" onClick={handleCreate}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      </ModalAlert>
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
            cellHandler={cellHandler}
            headerElement={(
              <div>
                <button className="btn  m-2" type="button" onClick={() => setShowCreate(true)}>
                  Create Model Category
                </button>
              </div>
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
            cellHandler={cellHandler}
            headerElement={(
              <div>
                <button className="btn  m-2" type="button" onClick={() => setShowCreate(true)}>
                  Create Instrument Category
                </button>
              </div>
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
