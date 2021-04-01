import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CustomFormStep from './CustomFormStep';
import { PopOverFragment } from './PopOver';
import LinkedList from '../objects/LinkedList';

// TODO: Lift state from form step into parent
// TODO: Arbitrary ordering, create, delete of steps
// TODO: Linked list for position (when you add something from middle, insert)
export default function CustomFormBuilder() {
  const emptyState = {
    header: '',
    plaintext: '',
    numeric: false,
    numericLabel: '',
    low: 0,
    high: 0,
    text: false,
    textLabel: '',
  };
  // eslint-disable-next-line no-unused-vars
  let nextId = 1;
  const initState = new Map().set(0, emptyState); // TODO: Make shallow copy of state
  const [state, setState] = React.useState(initState);
  const linkedList = new LinkedList(0);
  console.log(linkedList);

  const handleSubmit = () => {
    console.log('submitting form with state: ');
    console.log(state);
  };
  const updateState = (id, event, value) => {
    console.log(`updateState(${id}, ${event}, ${value})`);
    const nextState = state;
    nextState.set(id, {
      ...state.get(id),
      [event]: value,
    });
    setState(nextState);
  };
  const createStep = (id) => {
    console.log(`createStep after id: ${id}`);
    const nextState = state;
    nextState.set(nextId, emptyState);
    setState(nextState);
    linkedList.insertAfter(id, nextId);
    nextId += 1;
  };
  const deleteStep = (id) => {
    console.log(`deleteStep from id: ${id}`);
    const nextState = state;
    nextState.delete(id);
    setState(nextState);
    linkedList.deleteNode(id);
  };

  const addButton = (id) => (
    <PopOverFragment message="Add Step">
      <IconButton onClick={() => createStep(id)}>
        <AddCircleIcon style={{ color: '#11fc85' }} />
      </IconButton>
    </PopOverFragment>
  );
  const deleteButton = (id) => (
    <PopOverFragment message="Delete Step">
      <IconButton onClick={() => deleteStep(id)}>
        <DeleteIcon style={{ color: '#fc2311' }} />
      </IconButton>
    </PopOverFragment>
  );

  let formSteps;
  React.useEffect(() => {
    console.log('Updating render of formSteps');
    formSteps = [];
    const iterator = state.entries();
    while (iterator.next()) {
      const tuple = iterator.next();
      const key = tuple[0];
      const value = tuple[1];
      formSteps.push(<CustomFormStep
        id={key}
        state={value}
        updateState={updateState}
        addButton={addButton}
        deleteButton={deleteButton}
      />);
    }
  }, state);

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      {formSteps}
      <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button>
    </>
  );
}
