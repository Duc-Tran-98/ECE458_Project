/* eslint-disable no-nested-ternary */
/*
 This file is for the model categories component
*/
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SimpleGrid from './SimpleGrid';

import GetModelCategories, { CountModelsAttached } from '../queries/GetModelCategories';
import GetInstrumentCategories, { CountInstrumentsAttached } from '../queries/GetInstrumentCategories';
import DeleteModelCategory from '../queries/DeleteModelCategory';
import DeleteInstrumentCategory from '../queries/DeleteInstrumentCategory';
import CreateInstrumentCategory from '../queries/CreateInstrumentCategory';
import CreateModelCategory from '../queries/CreateModelCategory';
import EditModelCategory from '../queries/EditModelCategory';
import EditInstrumentCategory from '../queries/EditInstrumentCategory';
import UserContext from './UserContext';

export default function CategoryManager({ type }) {
  CategoryManager.propTypes = {
    type: PropTypes.string.isRequired,
  };
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
    let response = '';
    if (type.includes('model')) {
      response = await GetModelCategories({ limit: 1000, offset: 0 });
    } else if (type.includes('instrument')) {
      response = await GetInstrumentCategories({ limit: 1000, offset: 0 });
    }
    setCategories(response);
  }, [updateCount]);

  const getNumAttached = async () => {
    let response = '';
    if (type.includes('model')) {
      response = await CountModelsAttached({ name: category });
    } else if (type.includes('instrument')) {
      response = await CountInstrumentsAttached({ name: category });
    }
    setNum(response);
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
    if (type.includes('model')) {
      DeleteModelCategory({ name: category, handleResponse });
    } else if (type.includes('instrument')) {
      DeleteInstrumentCategory({ name: category, handleResponse });
    }
  };
  const handleEdit = (catName) => {
    setShowEdit(false);
    setUpdateCount(updateCount + 1);
    setLoading(true);
    if (type.includes('model')) {
      EditModelCategory({
        currentName: category,
        updatedName: catName,
        handleResponse,
      });
    } else if (type.includes('instrument')) {
      EditInstrumentCategory({
        currentName: category,
        updatedName: catName,
        handleResponse,
      });
    }
  };
  const handleCreate = (catName) => {
    setLoading(true);
    if (type.includes('model')) {
      CreateModelCategory({ name: catName, handleResponse });
    } else if (type.includes('instrument')) {
      CreateInstrumentCategory({ name: catName, handleResponse });
    }
  };

  const suffix = type.includes('model') ? 'model' : 'instrument';
  const deleteContent = (
    <>
      <div>
        <div className="h5 text-center my-3">
          {`You are about to delete category "${category}" which is attached to ${num} ${suffix}${
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
    let basePermission = user.modelPermission;
    if (type.includes('instrument')) {
      basePermission = user.instrumentPermission;
    }
    const show = (user.isAdmin || basePermission) && !showEdit && !showDelete;
    setShowCreate(show);
  }, [categories, showEdit, showDelete]);

  return (
    <>
      {showCreate && createCategory}
      {showEdit && editContent}
      {showDelete && deleteContent}
      {showTable && categoryTable}
    </>
  );
}
