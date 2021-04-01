import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CustomFormStep from './CustomFormStep';
import { PopOverFragment } from './PopOver';

// TODO: Lift state from form step into parent
// TODO: Arbitrary ordering, create, delete of steps
// TODO: Debug state.map function
export default function CustomFormBuilder() {
  const stepObj = (id) => ({
    id,
    header: '',
    plaintext: '',
    numeric: false,
    numericLabel: '',
    low: 0,
    high: 0,
    text: false,
    textLabel: '',
  });
  // eslint-disable-next-line no-unused-vars
  const [lastId, setLastId] = React.useState(0);
  const [state, setState] = React.useState([stepObj(0)]);
  const handleSubmit = () => {
    console.log('submitting form with state: ');
    console.log(state);
  };
  const updateState = (id, event, value) => {
    console.log(`updateState(${id}, ${event}, ${value})`);
  };

  const createNewStep = () => {
    console.log('Creating new step');
    const newState = state.push(stepObj(1));
    setState(newState);
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
  let formSteps = state.map((element) => (
    <CustomFormStep
      id={element.id}
      state={element}
      updateState={updateState}
      addButton={addButton}
      deleteButton={deleteButton}
    />
  ));
  React.useEffect(() => {
    formSteps = state.map((element) => (
      <CustomFormStep
        id={element.id}
        state={element}
        updateState={updateState}
        addButton={addButton}
        deleteButton={deleteButton}
      />
    ));
  }, state);

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      {formSteps}
      <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button>
    </>
  );
}
