/* eslint-disable no-unused-vars */
import React from 'react';
import CustomFormStep from './CustomFormStep';
import { PreviewButton, EditPopoverIcon, MuiSaveButton } from './CustomMuiIcons';

export default function CustomFormBuilder() {
  const emptyHeader = {
    type: 'header',
    prompt: '',
  };
  const initState = [emptyHeader];
  const [state, setState] = React.useState(initState);
  const [formSteps, setFormSteps] = React.useState([]);
  const [wizard, setWizard] = React.useState();
  const [mode, setMode] = React.useState('editing');

  const handleSubmit = () => {
    alert(`submitting form with state: ${JSON.stringify(state)}`);
  };
  const updateState = (index, event, value) => {
    // console.log(`updateState(${index}, ${event}, ${value})`);
    const prevState = [...state];
    prevState[index] = {
      ...prevState[index],
      [event]: value,
    };
    setState(prevState);
  };
  const createStep = (index) => {
    const prevState = [...state];
    prevState.splice(index + 1, 0, Object.create(emptyHeader));
    setState(prevState);
  };
  const deleteStep = (index) => { // Cannot delete last step
    console.log(`deleteStep with id: ${index}\tprevState, nextState`);
    if (state.length > 1) {
      const prevState = [...state];
      const nextState = prevState.filter((item, i) => index !== i);
      console.log(prevState);
      console.log(nextState);
      setState(nextState);
    }
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
        canDelete={state.length > 1}
      />
    ));
    setFormSteps(steps);
  }, [state]);

  // React.useEffect(() => {
  //   setWizard(<CustomFormWizard getSteps={() => state} onFinish={() => alert('just finished')} />);
  // }, [state]);

  return (
    <>
      <div>
        <div className="form-builder-header m-4">
          {/* <h1 className="m-2">Custom Form Builder</h1>
          <h3 className="m-2">{`Total Steps: ${size}`}</h3> */}
          {mode === 'editing' && <PreviewButton onClick={() => setMode('preview')} message="Preview" />}
          {mode === 'preview' && <EditPopoverIcon onClick={() => setMode('editing')} message="Edit" />}
          <MuiSaveButton onClick={handleSubmit} color="primary" />
        </div>
        <div className="mb-5">
          {mode === 'editing' && formSteps}
          {mode === 'preview' && wizard}
        </div>

        {/* <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button> */}
      </div>
    </>
  );
}
