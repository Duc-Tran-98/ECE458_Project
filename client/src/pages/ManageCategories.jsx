/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { ServerPaginationGrid } from '../components/UITable';
import ModalAlert from '../components/ModalAlert';
import MouseOverPopover from '../components/PopOver';
import GetModelCategories, { CountModelCategories, CountModelsAttached } from '../queries/GetModelCategories';
import GetInstrumentCategories, { CountInstrumentCategories, CountInstrumentsAttached } from '../queries/GetInstrumentCategories';
import DeleteModelCategory from '../queries/DeleteModelCategory';
import DeleteInstrumentCategory from '../queries/DeleteInstrumentCategory';
import CreateInstrumentCategory from '../queries/CreateInstrumentCategory';
import CreateModelCategory from '../queries/CreateModelCategory';
import EditModelCategory from '../queries/EditModelCategory';
import EditInstrumentCategory from '../queries/EditInstrumentCategory';
import UserContext from '../components/UserContext';
// TODO: SPLIT UP THIS PAGE INTO MODELS/INSTRUMENTS

function ManageCategories({ modifyCount }) {
  ManageCategories.propTypes = {
    modifyCount: PropTypes.func.isRequired,
  };
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
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
  const [category, setCategory] = React.useState('');
  const [showDelete, setShowDelete] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [num, setNum] = React.useState(0);
  const [newCategory, setNewCategory] = React.useState('');
  const user = React.useContext(UserContext);

  const cellHandler = (e) => {
    setCategory(e.row.name);
  };

  const getNumAttached = async () => {
    if (key === 'model') {
      const count = await CountModelsAttached({ name: category });
      setNum(count);
    } else {
      const count = await CountInstrumentsAttached({ name: category });
      setNum(count);
    }
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
            onClick={async () => {
              await getNumAttached();
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
    const searchString = `?page=${initPage}&limit=${initLimit}`;
    if (!window.location.href.includes(`/${k}Categories${searchString}`)) {
      if (replace) {
        history.replace(`/${k}Categories${searchString}`);
      } else {
        history.push(`/${k}Categories${searchString}`);
      }
    }
  }

  history.listen((location) => {
    let active = true;

    (() => {
      if (!active) {
        return;
      }
      urlParams = new URLSearchParams(location.search);
      const lim = parseInt(urlParams.get('limit'), 10);
      const pg = parseInt(urlParams.get('page'), 10);
      if (lim !== initLimit) {
        setInitLimit(lim);
      }
      if (pg !== initPage) {
        setInitPage(pg);
      }

      if (location.pathname.startsWith('/model')) {
        setKey('model');
      } else {
        setKey('instrument');
      }
    })();

    return () => {
      active = false;
    };
  });

  const closeDeleteModal = () => {
    setShowDelete(false);
    updateRow(key, true);
  };
  const closeEditModal = () => {
    setShowEdit(false);
    updateRow(key, true);
  };
  const closeCreateModal = () => {
    setShowCreate(false);
    updateRow(key, true);
  };
  const handleResponse = (response) => {
    if (response.success) {
      modifyCount();
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
    if (key === 'model') {
      DeleteModelCategory({ name: category, handleResponse });
    } else {
      DeleteInstrumentCategory({ name: category, handleResponse });
    }
  };
  const handleEdit = (catName) => {
    setLoading(true);
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
      <ModalAlert
        show={showDelete}
        handleClose={closeDeleteModal}
        title="Delete Category"
        width=" "
      >
        <>
          {showDelete && (
            <div>
              <div className="h4 text-center my-3">
                {`You are about to delete category ${category}. This category is attached to ${num} ${key}${
                  num === 1 ? '' : 's'
                }. Are you sure?`}

              </div>
            </div>
          )}
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
      {key === 'model' && (
        <ServerPaginationGrid
          rowCount={() => CountModelCategories().then((val) => val)}
          cellHandler={cellHandler}
          headerElement={(
            <div>
              {(user.isAdmin || user.modelPermission) && (
                <button
                  className="btn  m-2"
                  type="button"
                  onClick={() => setShowCreate(true)}
                >
                  Create Model Category
                </button>
              )}
            </div>
          )}
          cols={cols}
          initPage={initPage}
          initLimit={initLimit}
          onPageChange={(page, limit) => {
            const searchString = `?page=${page}&limit=${limit}`;
            if (window.location.search !== searchString) {
              history.push(`/modelCategories${searchString}`);
            }
          }}
          onPageSizeChange={(page, limit) => {
            const searchString = `?page=${page}&limit=${limit}`;
            if (window.location.search !== searchString) {
              history.push(`/modelCategories${searchString}`);
            }
          }}
          fetchData={(limit, offset) => GetModelCategories({ limit, offset }).then((response) => response)}
          showToolBar={false}
          showImport={false}
        />
      )}
      {key === 'instrument' && (
        <ServerPaginationGrid
          rowCount={() => CountInstrumentCategories().then((val) => val)}
          cellHandler={cellHandler}
          headerElement={(
            <div>
              {(user.isAdmin || user.instrumentPermission) && (
                <button
                  className="btn  m-2"
                  type="button"
                  onClick={() => setShowCreate(true)}
                >
                  Create Instrument Category
                </button>
              )}
            </div>
          )}
          cols={cols}
          initPage={initPage}
          initLimit={initLimit}
          onPageChange={(page, limit) => {
            const searchString = `?page=${page}&limit=${limit}`;
            if (window.location.search !== searchString) {
              history.push(`/instrumentCategories${searchString}`);
            }
          }}
          onPageSizeChange={(page, limit) => {
            const searchString = `?page=${page}&limit=${limit}`;
            if (window.location.search !== searchString) {
              history.push(`/instrumentCategories${searchString}`);
            }
          }}
          fetchData={(limit, offset) => GetInstrumentCategories({ limit, offset }).then(
            (response) => response,
          )}
          showToolBar={false}
          showImport={false}
        />
      )}
    </>
  );
}

export default ManageCategories;
