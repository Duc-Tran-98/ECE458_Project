/* eslint-disable no-unused-vars */
import React from 'react';
import CustomFormStep from './CustomFormStep';
import { PreviewButton, EditPopoverIcon, MuiSaveButton } from './CustomMuiIcons';
import CustomFormWizard from './CustomFormWizard';

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
    prevState.splice(index + 1, 0, Object.create(emptyState));
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
    setFormSteps(steps);
  }, [state]);

  React.useEffect(() => {
    setWizard(<CustomFormWizard getSteps={() => state} onFinish={() => alert('just finished')} />);
  }, [state]);

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
