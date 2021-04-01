import React from 'react';
import CustomFormStep from './CustomFormStep';
import LinkedList from '../objects/LinkedList';

// TODO: Keep state synced with child component
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
  const [update, setUpdate] = React.useState(0);
  const [formSteps, setFormSteps] = React.useState([]);
  const [size, setSize] = React.useState(1);
  const linkedList = new LinkedList(0);
  const map = new Map().set(0, Object.create(emptyState));

  const handleSubmit = () => {
    console.log('submitting form with map: ');
    console.log(map);
  };
  const updateState = (id, event, value) => {
    console.log(`updateState(${id}, ${event}, ${value})`);
    map.set(id, {
      ...map.get(id),
      [event]: value,
    });
    setUpdate(update + 1);
  };
  const createStep = (id) => {
    console.log(`createStep after id: ${id}`);
    map.set(id, Object.create(emptyState));
    linkedList.insertAfter(id, nextId);
    nextId += 1;
  };
  const deleteStep = (id) => {
    console.log(`deleteStep with id: ${id}`);
    map.delete(id);
    linkedList.deleteNode(id);
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
        state={map.get(key)}
        updateState={updateState}
        createStep={createStep}
        deleteStep={deleteStep}
      />
    ));
    console.log('formSteps: ');
    console.log(steps);
    setFormSteps(steps);
    setSize(linkedList.size());
  }, update);

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      <h3 className="m-2">{`Total Steps: ${size}`}</h3>
      {formSteps}
      <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button>
    </>
  );
}
