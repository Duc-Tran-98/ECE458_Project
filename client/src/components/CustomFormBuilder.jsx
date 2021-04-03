import React from 'react';
import CustomFormStep from './CustomFormStep';

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
  const initState = [emptyState];
  const [size, setSize] = React.useState(1);
  const [state, setState] = React.useState(initState);
  const [formSteps, setFormSteps] = React.useState([]);

  const handleSubmit = () => {
    console.log('submitting form with state: ');
    console.log(state);
  };
  const updateState = (index, event, value) => {
    console.log(`updateState(${index}, ${event}, ${value})`);
    const prevState = [...state];
    prevState[index] = {
      ...prevState[index],
      [event]: value,
    };
    setState(prevState);
  };
  const createStep = (index) => {
    console.log(`createStep after index: ${index}`);
    const prevState = [...state];
    prevState.splice(index, 0, Object.create(emptyState));
    setState(prevState);
  };
  const deleteStep = (index) => {
    console.log(`deleteStep with id: ${index}`);
    const prevState = [...state];
    const nextState = prevState.splice(index, 1);
    setState(nextState);
  };

  React.useEffect(() => {
    const steps = state.map((entry, index) => (
      <CustomFormStep
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        id={index}
        state={entry}
        updateState={updateState}
        createStep={createStep}
        deleteStep={deleteStep}
      />
    ));
    console.log('formSteps: ');
    console.log(steps);
    setFormSteps(steps);
    setSize(steps.length);
  }, [state]);

  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      <h3 className="m-2">{`Total Steps: ${size}`}</h3>
      {formSteps}
      <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button>
    </>
  );
}
