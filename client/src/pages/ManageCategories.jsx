/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import { ServerPaginationGrid } from '../components/UITable';
import ModalAlert from '../components/ModalAlert';
import MouseOverPopover from '../components/PopOver';
import GetModelCategories, { CountModelCategories } from '../queries/GetModelCategories';
import GetInstrumentCategories, { CountInstrumentCategories } from '../queries/GetInstrumentCategories';
import DeleteModelCategory from '../queries/DeleteModelCategory';
import DeleteInstrumentCategory from '../queries/DeleteInstrumentCategory';
import CreateInstrumentCategory from '../queries/CreateInstrumentCategory';
import CreateModelCategory from '../queries/CreateModelCategory';
import EditModelCategory from '../queries/EditModelCategory';
import EditInstrumentCategory from '../queries/EditInstrumentCategory';

function ManageCategories() {
  const history = useHistory();
  const navLink = document.getElementById('modelCatNavLink');
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
  const [showDelete, setShowDelete] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');

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
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        <MouseOverPopover message="Delete category">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              console.log('delete cat');
              setShowDelete(true);
            }}
          >
            Delete
          </button>
        </MouseOverPopover>
      ),
    },
  ];

  function updateRow(k, replace = false) {
    console.log('update');
    let searchString;
    setInitPage(1);
    setInitLimit(25);
    if (k === 'model') {
      CountModelCategories().then((val) => {
        setRowCount(val);
        searchString = `?page=${initPage}&limit=${initLimit}&count=${val}`;
        if (!window.location.href.includes(`/${k}Categories${searchString}`)) {
          console.log(`updating url to /${k}Categories${searchString}`);
          if (replace) {
            history.replace(`/${k}Categories${searchString}`);
          } else {
            history.push(`/${k}Categories${searchString}`);
          }
        }
      });
    } else {
      CountInstrumentCategories().then((val) => {
        setRowCount(val);
        console.log(val);
        searchString = `?page=${initPage}&limit=${initLimit}&count=${val}`;
        if (!window.location.href.includes(`/${k}Categories${searchString}`)) {
          console.log(`updating url to /${k}Categories${searchString}`);
          if (replace) {
            history.replace(`/${k}Categories${searchString}`);
          } else {
            history.push(`/${k}Categories${searchString}`);
          }
        }
      });
    }
  }

  if (navLink !== null) {
    navLink.onclick = () => {
      updateRow('model');
      setKey('model');
    };
  }

  history.listen((location, action) => {
    let active = true;

    (() => {
      if (!active) {
        return;
      }
      urlParams = new URLSearchParams(location.search);
      const lim = parseInt(urlParams.get('limit'), 10);
      const pg = parseInt(urlParams.get('page'), 10);
      const count = parseInt(urlParams.get('count'), 10);
      if (action === 'POP') {
        setRowCount(count);
        setInitLimit(lim);
        setInitPage(pg);
        // console.log('was a pop');
        if (window.location.pathname.startsWith('/model')) {
          setKey('model');
          // console.log('setting start tab = model');
        } else {
          setKey('instrument');
          //  console.log('setting start tab = instrument');
        }
      }
    })();

    return () => {
      active = false;
    };
  });

  const closeDeleteModal = () => {
    setShowDelete(false);
    console.log('close');
    updateRow(key, true);
  };
  const closeEditModal = () => {
    setShowEdit(false);
    console.log('close');
    updateRow(key, true);
  };
  const closeCreateModal = () => {
    setShowCreate(false);
    console.log('close');
    updateRow(key, true);
  };
  const handleResponse = (response) => {
    if (response.success) {
      toast.success(response.message, {
        toastId: Math.random(),
      });
    } else {
      toast.error(response.message, {
        toastId: Math.random(),
      });
    }
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    updateRow(key, true);
    setLoading(false);
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
  const handleEdit = (catName) => {
    setLoading(true);
    console.log('edit');
    if (key === 'model') {
      EditModelCategory({ currentName: category, updatedName: catName, handleResponse });
    } else {
      EditInstrumentCategory({ currentName: category, updatedName: catName, handleResponse });
    }
  };
  const handleCreate = (catName) => {
    setLoading(true);
    if (key === 'model') {
      CreateModelCategory({ name: catName, handleResponse });
    } else {
      CreateInstrumentCategory({ name: catName, handleResponse });
    }
  };

  return (
    <>
      <ToastContainer />
      <ModalAlert
        show={showDelete}
        handleClose={closeDeleteModal}
        title="Delete Category"
        width=" "
      >
        <>
          <div className="d-flex flex-row text-center m-3">
            <h5>{`Confirm delete category: ${category}`}</h5>
          </div>
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <button
                  className="btn mt-2"
                  type="button"
                  onClick={handleDelete}
                >
                  Yes
                </button>
                <span className="mx-3" />
                <button
                  className="btn mt-2"
                  type="button"
                  onClick={closeDeleteModal}
                >
                  No
                </button>
              </>
            )}
          </div>
        </>
      </ModalAlert>
      <ModalAlert
        show={showEdit}
        handleClose={closeEditModal}
        title="Edit Category"
        width=" "
      >
        <>
          <div className="d-flex flex-row text-center m-3">
            <h5>{`Change name of category: ${category}`}</h5>
          </div>
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <div className="row">
                  <input
                    id="editCat"
                    value={newCategory}
                    className="m-2 col-auto my-auto"
                    onChange={(e) => {
                      if (!e.target.value.includes(' ')) {
                        setNewCategory(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.code === 'Enter' && newCategory.length > 0) {
                        handleEdit(document.getElementById('editCat').value);
                      }
                    }}
                  />
                  <button
                    className="btn m-3 col"
                    type="button"
                    onClick={() => {
                      handleEdit(document.getElementById('editCat').value);
                    }}
                  >
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
        title="Add Category"
        width=" "
      >
        <>
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : (
              <div className="row">
                <input
                  className="m-2 col-auto my-auto"
                  id="cat"
                  value={newCategory}
                  onChange={(e) => {
                    if (!e.target.value.includes(' ')) {
                      setNewCategory(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.code === 'Enter' && newCategory.length > 0) {
                      setNewCategory('');
                      handleCreate(document.getElementById('cat').value);
                    }
                  }}
                  placeholder="Enter category name"
                />
                <div className="col">
                  <button
                    className="btn "
                    type="button"
                    onClick={() => {
                      setNewCategory('');
                      handleCreate(document.getElementById('cat').value);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      </ModalAlert>
      <Tabs
        id="tabs"
        activeKey={key}
        onSelect={(k) => {
          updateRow(k);
          setKey(k);
        }}
        unmountOnExit
      >
        <Tab eventKey="model" title="Model Categories">
          <ServerPaginationGrid
            rowCount={rowCount}
            cellHandler={cellHandler}
            headerElement={(
              <div>
                <button
                  className="btn  m-2"
                  type="button"
                  onClick={() => setShowCreate(true)}
                >
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
                console.log(
                  `page change model changing url to /modelCategories${searchString}`,
                );
                history.push(`/modelCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            onPageSizeChange={(page, limit) => {
              const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
              if (window.location.search !== searchString) {
                console.log('page size change model changing url');
                history.push(`/modelCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            fetchData={(limit, offset) => GetModelCategories({ limit, offset }).then((response) => response)}
            showToolBar={false}
          />
        </Tab>
        <Tab eventKey="instrument" title="Instrument Categories">
          <ServerPaginationGrid
            rowCount={rowCount}
            cellHandler={cellHandler}
            headerElement={(
              <div>
                <button
                  className="btn  m-2"
                  type="button"
                  onClick={() => setShowCreate(true)}
                >
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
                console.log(
                  `page change instrument changing url to /instrumentCategories${searchString}`,
                );
                history.push(`/instrumentCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            onPageSizeChange={(page, limit) => {
              const searchString = `?page=${page}&limit=${limit}&count=${rowCount}`;
              if (window.location.search !== searchString) {
                console.log('page size change instrument changing url');
                history.push(`/instrumentCategories${searchString}`);
                setInitLimit(limit);
                setInitPage(page);
              }
            }}
            fetchData={(limit, offset) => GetInstrumentCategories({ limit, offset }).then(
              (response) => response,
            )}
            showToolBar={false}
          />
        </Tab>
      </Tabs>
    </>
  );
}

export default ManageCategories;
