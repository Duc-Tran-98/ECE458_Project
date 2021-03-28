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
  const [shouldUpdate, setShouldUpdate] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const [num, setNum] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const user = React.useContext(UserContext);
  const [categories, setCategories] = React.useState(null);
  const [content, setContent] = React.useState(null);
  // TODO: Add set title option

  // const handleGetCategories = (response) => {

  // };
  React.useEffect(async () => {
    const response = await GetModelCategories({ limit: 10, offset: 0 });
    setCategories(response);
  }, [shouldUpdate]);

  const getNumAttached = async () => {
    const count = await CountModelsAttached({ name: category });
    setNum(count);
  };

  const handleResponse = (response) => {
    setShouldUpdate(true);
    if (response.success) {
      setContent();
      // setShowEdit(false);
      // setShowDelete(false);
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
              onClick={() => setShouldUpdate(true)}
            >
              No
            </button>
          </>
        )}
      </div>
    </>
  );

  // const deleteModal = (
  //   <StateLessCloseModal
  //     title="Delete Category"
  //     show={showDelete}
  //     handleClose={() => setShowDelete(false)}
  //   >
  //     {deleteContent}
  //   </StateLessCloseModal>
  // );

  const deleteBtn = (
    <IconButton onClick={() => setContent(deleteContent)}>
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
      headerName: '',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: () => (
        deleteBtn
      ),
    },
  ];

  const createCategory = (
    <>
      <div className="row m4">
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

  setContent(createCategory);

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
        setCategory(e.row.name);
        getNumAttached();
        setContent(editContent);
      }}
      cols={cols}
    />
  );
  setContent(categoryTable);

  React.useEffect(() => {
    setContent(categoryTable);
  }, [shouldUpdate]);

  // TODO: Add permissions conditional rendering here
  return (
    <>
      {content}
      {/* {editModal}
      {deleteModal} */}
      {(user.isAdmin || user.modelPermission) && createCategory}
      {categories !== null && content}
    </>
  );
}
export default ModelCategories;
