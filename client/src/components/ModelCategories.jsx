/* eslint-disable no-nested-ternary */
/*
 This file is for the model categories component
*/
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { ServerPaginationGrid } from './UITable';
import ModalAlert, { StateLessModal } from './ModalAlert';
import GetModelCategories, { CountModelCategories, CountModelsAttached } from '../queries/GetModelCategories';
import DeleteModelCategory from '../queries/DeleteModelCategory';
import CreateModelCategory from '../queries/CreateModelCategory';
import EditModelCategory from '../queries/EditModelCategory';
import UserContext from './UserContext';

function ModelCategories() {
  const initPage = 10;
  const initLimit = 10;

  const [category, setCategory] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [num, setNum] = React.useState(0);
  const [newCategory, setNewCategory] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const user = React.useContext(UserContext);

  const getNumAttached = async () => {
    const count = await CountModelsAttached({ name: category });
    setNum(count);
  };

  const cellHandler = (e) => {
    setCategory(e.row.name);
    getNumAttached();
  };

  const handleResponse = (response) => {
    if (response.success) {
      setShowEdit(false);
      setShowDelete(false);
      toast.success(response.message, {
        toastId: Math.random(),
      });
    } else {
      toast.error(response.message, {
        toastId: Math.random(),
      });
    }
    // updateRow(key, true);
    setLoading(false);
  };
  const handleDelete = () => {
    setLoading(true);
    DeleteModelCategory({ name: category, handleResponse });
  };
  const handleEdit = (catName) => {
    setLoading(true);
    EditModelCategory({
      currentName: category,
      updatedName: catName,
      handleResponse,
    });
  };
  const handleCreate = (catName) => {
    setLoading(true);
    CreateModelCategory({ name: catName, handleResponse });
  };

  const createBtn = (
    <ModalAlert
      title="Add Category"
      btnText="Create Model Category"
      btnClass="btn m-2"
      width=" "
    >
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
    </ModalAlert>
  );

  const deleteBtn = (
    <button type="button" className="btn btn-danger" onClick={() => setShowDelete(true)}>Delete</button>
  );

  const editBtn = (
    <button type="button" className="btn" onClick={() => setShowEdit(true)}>
      Edit
    </button>
  );

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
        editBtn
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 120,
      disableColumnMenu: true,
      renderCell: () => (
        deleteBtn
      ),
    },
  ];

  return (
    <>
      <StateLessModal
        title="Edit Category"
        width=""
        handleClose={() => setShowEdit(false)}
        show={showEdit}
      >
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
                      setNewCategory('');
                      handleEdit(document.getElementById('editCat').value);
                    }
                  }}
                />
                <button
                  className="btn m-3 col"
                  type="button"
                  onClick={() => {
                    setNewCategory('');
                    handleEdit(document.getElementById('editCat').value);
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </StateLessModal>
      <StateLessModal
        title="Delete Category"
        width=" "
        show={showDelete}
        handleClose={() => setShowDelete(false)}
      >
        <div>
          <div className="h5 text-center my-3">
            {`You are about to delete category ${category}. This category is attached to ${num} model${
              num === 1 ? '' : 's'
            }. Are you sure?`}
          </div>
        </div>

        <div className="d-flex justify-content-center">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <button className="btn mt-2" type="button" onClick={handleDelete}>
                Yes
              </button>
              <span className="mx-3" />
              <button
                className="btn mt-2"
                type="button"
                onClick={() => setShowDelete(false)}
              >
                No
              </button>
            </>
          )}
        </div>
      </StateLessModal>
      <ServerPaginationGrid
        rowCount={() => CountModelCategories().then((val) => val)}
        cellHandler={cellHandler}
        headerElement={
          <div>{(user.isAdmin || user.modelPermission) && createBtn}</div>
        }
        cols={cols}
        initPage={initPage}
        initLimit={initLimit}
        fetchData={(limit, offset) => GetModelCategories({ limit, offset }).then((response) => response)}
        showToolBar={false}
        showImport={false}
      />
    </>
  );
}

export default ModelCategories;
