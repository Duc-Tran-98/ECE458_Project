/* eslint-disable no-nested-ternary */
/*
 This file is for the model categories component
*/
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import SimpleGrid from './SimpleGrid';
import GetModelCategories, { CountModelsAttached } from '../queries/GetModelCategories';
import DeleteModelCategory from '../queries/DeleteModelCategory';
import CreateModelCategory from '../queries/CreateModelCategory';
import EditModelCategory from '../queries/EditModelCategory';
import UserContext from './UserContext';

function ModelCategories() {
  const [updateCount, setUpdateCount] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [num, setNum] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showTable, setShowTable] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(true);
  const [newCategory, setNewCategory] = React.useState('');
  const user = React.useContext(UserContext);
  const [categories, setCategories] = React.useState(null);

  React.useEffect(async () => {
    const response = await GetModelCategories({ limit: 10, offset: 0 });
    setCategories(response);
  }, [updateCount]);

  const getNumAttached = async () => {
    const count = await CountModelsAttached({ name: category });
    setNum(count);
  };

  const handleResponse = (response) => {
    setUpdateCount(updateCount + 1);
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
    setShowDelete(false);
    setUpdateCount(updateCount + 1);
    setLoading(true);
    DeleteModelCategory({ name: category, handleResponse });
  };
  const handleEdit = (catName) => {
    setShowEdit(false);
    setUpdateCount(updateCount + 1);
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

  const deleteContent = (
    <>
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
              onClick={() => setUpdateCount(updateCount + 1)}
            >
              No
            </button>
          </>
        )}
      </div>
    </>
  );

  const deleteBtn = (
    <IconButton onClick={() => setShowDelete(true)}>
      <DeleteIcon />
    </IconButton>
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
      headerName: 'Category Name',
      sortable: false,
      width: 200,
    },
    {
      field: 'delete',
      headerName: ' ',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: () => (
        deleteBtn
      ),
    },
  ];

  const createCategory = (
    <>
      <div className="row m4 text-center">
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
          <IconButton onClick={() => {
            setNewCategory('');
            handleCreate(document.getElementById('cat').value);
          }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </>
  );

  const editContent = (
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
    </>
  );

  // const editModal = (
  //   <StateLessCloseModal
  //     title="Edit Category"
  //     handleClose={() => setShowEdit(false)}
  //     show={showEdit}
  //   >
  //     {editContent}
  //   </StateLessCloseModal>
  // );

  const categoryTable = (
    <SimpleGrid
      rows={categories}
      cellHandler={(e) => {
        console.log(e);
        setCategory(e.row.name);
        getNumAttached();
        if (e.field === 'delete') {
          setShowDelete(true);
        } else {
          setShowEdit(true);
        }
      }}
      cols={cols}
    />
  );

  React.useEffect(() => {
    const show = categories !== null && !showEdit && !showDelete;
    setShowTable(show);
  }, [categories, showEdit, showDelete]);

  React.useEffect(() => {
    const show = (user.isAdmin || user.modelPermission) && !showEdit && !showDelete;
    setShowCreate(show);
  }, [categories, showEdit, showDelete]);

  // TODO: Add permissions conditional rendering here
  return (
    <>
      {showCreate && createCategory}
      {showEdit && editContent}
      {showDelete && deleteContent}
      {showTable && categoryTable}
    </>
  );
}
export default ModelCategories;
