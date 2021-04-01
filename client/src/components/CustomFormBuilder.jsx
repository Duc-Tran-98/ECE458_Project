import React from 'react';
import CustomFormStep from './CustomFormStep';
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
  let nextId = 1;
  const initState = new Map().set(0, emptyState); // TODO: Make shallow copy of state
  const [state, setState] = React.useState(initState);
  const [formSteps, setFormSteps] = React.useState([]);
  const [size, setSize] = React.useState(1);
  const linkedList = new LinkedList(0);

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
    console.log('nextState and then linkedList');
    console.log(nextState);
    console.log(linkedList);
    nextId += 1;
    setSize(linkedList.size());
  };
  const deleteStep = (id) => {
    console.log(`deleteStep from id: ${id}`);
    const nextState = state;
    nextState.delete(id);
    setState(nextState);
    linkedList.deleteNode(id);
    console.log(linkedList);
    setSize(linkedList.size());
  };

  const generateKeysArray = () => {
    const arr = [];
    let node = linkedList.head;
    while (node) {
      arr.push(node.data);
      node = node.next;
    }
    console.log('created array from linked list: ');
    console.log(arr);
    return arr;
  };
  React.useEffect(() => {
    const arr = generateKeysArray();
    const steps = arr.map((key) => (
      <CustomFormStep
        key={key}
        id={key}
        state={state.get(key)}
        updateState={updateState}
        createStep={createStep}
        deleteStep={deleteStep}
      />
    ));
    console.log('formSteps: ');
    console.log(steps);
    setFormSteps(steps);
  }, state);

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      <h3 className="m-2">{`Total Steps: ${size}`}</h3>
      {formSteps}
      <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button>
    </>
  );
}
