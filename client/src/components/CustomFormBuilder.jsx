import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CustomFormStep from './CustomFormStep';

export default function CustomFormBuilder() {
  const createNewStep = () => {
    console.log('Creating new step');
  };
  const addButton = (
    <IconButton onClick={createNewStep}>
      <AddCircleIcon style={{ color: '#11fc85' }} />
    </IconButton>
  );
  const deleteButton = (
    <IconButton onClick={createNewStep}>
      <DeleteIcon style={{ color: '#fc2311' }} />
    </IconButton>
  );

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      <CustomFormStep editing addButton={addButton} deleteButton={deleteButton} />
    </>
  );
}
