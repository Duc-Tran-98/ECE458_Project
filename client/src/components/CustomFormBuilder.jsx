import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CustomFormStep from './CustomFormStep';
import { PopOverFragment } from './PopOver';

const emptyForm = {
  header: '',
  plaintext: '',
  numeric: false,
  numericLabel: '',
  low: 0,
  high: 0,
  text: false,
  textLabel: '',
};

// TODO: Lift state from form step into parent
// TODO: Arbitrary ordering, create, delete of steps
export default function CustomFormBuilder() {
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = React.useState([emptyForm]);
  const handleSubmit = () => {
    console.log('submitting form with state: ');
    console.log(state);
  };

  const createNewStep = () => {
    console.log('Creating new step');
  };
  const addButton = (
    <PopOverFragment message="Add Step">
      <IconButton onClick={createNewStep}>
        <AddCircleIcon style={{ color: '#11fc85' }} />
      </IconButton>
    </PopOverFragment>
  );
  const deleteButton = (
    <PopOverFragment message="Delete Step">
      <IconButton onClick={createNewStep}>
        <DeleteIcon style={{ color: '#fc2311' }} />
      </IconButton>
    </PopOverFragment>
  );

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      <CustomFormStep editing addButton={addButton} deleteButton={deleteButton} />
      <CustomFormStep editing addButton={addButton} deleteButton={deleteButton} />
      <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button>
    </>
  );
}
