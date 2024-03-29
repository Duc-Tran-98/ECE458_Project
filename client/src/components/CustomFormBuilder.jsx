import React from 'react';
import PropTypes from 'prop-types';
import {
  PreviewButton, EditPopoverIcon, MoveDownPopOver, MoveUpPopOver,
} from './CustomMuiIcons';
import {
  CustomHeaderInput, CustomUserPromptInput, CustomNumericInput, CustomTextInput,
} from './CustomFormComponents';
import CustomFormEntry from './CustomFormEntry';
import CustomFormAddMenu from './CustomFormAddMenu';
import {
  emptyHeader, emptyDescription, emptyTextInput, emptyNumericInput,
} from './FormContsants';

export default function CustomFormBuilder({
  state, setState, update, editEnabled,
}) {
  CustomFormBuilder.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    update: PropTypes.number.isRequired, // force updates on error handling
    editEnabled: PropTypes.bool.isRequired,
  };

  const [shouldUpdate, setShouldUpdate] = React.useState(0); // another internal effect to force updates (lol I hope I never have to edit this)
  const initMode = editEnabled === true ? 'editing' : 'preview';
  const [formSteps, setFormSteps] = React.useState([]);
  const [formEntry, setFormEntry] = React.useState();
  const [mode, setMode] = React.useState(initMode);
  const [focus, setFocus] = React.useState(0); // index of element to focus on

  const handleChange = (e, index) => {
    const nextState = [...state];
    nextState[index] = {
      ...nextState[index],
      [e.target.name]: e.target.value,
    };
    setState(nextState);
  };
  const handleChecked = (e, index) => {
    const nextState = [...state];
    nextState[index] = {
      ...nextState[index],
      [e.target.name]: e.target.checked,
    };
    setState(nextState);
  };
  const deleteStep = (index) => {
    if (state.length > 1) {
      const prevState = [...state];
      const nextState = prevState.filter((item, i) => index !== i);
      setState(nextState);
    }
  };
  const handleMoveUp = (index) => {
    const nextState = state;
    const cur = nextState[index];
    const prev = nextState[index - 1];
    nextState[index - 1] = { ...cur };
    nextState[index] = { ...prev };
    setState(nextState);
    setShouldUpdate(shouldUpdate + 1);
  };
  const handleMoveDown = (index) => {
    const nextState = state;
    const cur = nextState[index];
    const next = nextState[index + 1];
    nextState[index] = { ...next };
    nextState[index + 1] = { ...cur };
    setState(nextState);
    setShouldUpdate(shouldUpdate + 1);
  };

  const addElement = (type, index) => {
    const insertIndex = index !== null ? index : state.length;
    setFocus(insertIndex + 1);
    let obj = { ...emptyHeader };
    // eslint-disable-next-line default-case
    switch (type) {
      case 'header':
        obj = { ...emptyHeader };
        break;
      case 'description':
        obj = { ...emptyDescription };
        break;
      case 'number':
        obj = { ...emptyNumericInput };
        break;
      case 'text':
        obj = { ...emptyTextInput };
        break;
    }
    const prevState = [...state];
    prevState.splice(insertIndex + 1, 0, obj);
    setState(prevState);
  };

  const addButton = (index) => (
    <CustomFormAddMenu
      createHeader={() => addElement('header', index)}
      createUserPrompt={() => addElement('description', index)}
      createNumericInput={() => addElement('number', index)}
      createTextInput={() => addElement('text', index)}
      index={index}
    />
  );

  const moveUpButton = (index) => (
    <MoveUpPopOver
      title="Move Up"
      onClick={() => handleMoveUp(index)}
    />
  );
  const moveDownButton = (index) => (
    <MoveDownPopOver
      title="Move Down"
      onClick={() => handleMoveDown(index)}
    />
  );

  React.useEffect(() => {
    const steps = state.map((entry, index) => {
      switch (entry.type) {
        case 'header':
          return (
            <CustomHeaderInput
              header={entry.prompt}
              error={entry.error}
              helperText={entry.helperText}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
              autoFocus={focus === index}
              moveUpButton={moveUpButton(index)}
              moveDownButton={moveDownButton(index)}
              showUp={index !== 0}
              showDown={index !== state.length - 1}
            />
          );
        case 'description':
          return (
            <CustomUserPromptInput
              userPrompt={entry.prompt}
              error={entry.error}
              helperText={entry.helperText}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
              autoFocus={focus === index}
              moveUpButton={moveUpButton(index)}
              moveDownButton={moveDownButton(index)}
              showUp={index !== 0}
              showDown={index !== state.length - 1}
            />
          );
        case 'number':
          return (
            <CustomNumericInput
              prompt={entry.prompt}
              error={entry.error}
              helperText={entry.helperText}
              min={entry.min}
              minSet={entry.minSet}
              minError={entry.minError}
              minHelperText={entry.minHelperText}
              max={entry.max}
              maxSet={entry.maxSet}
              maxError={entry.maxError}
              maxHelperText={entry.maxHelperText}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              handleChecked={handleChecked}
              showDelete={state.length > 1}
              addButton={addButton(index)}
              autoFocus={focus === index}
              moveUpButton={moveUpButton(index)}
              moveDownButton={moveDownButton(index)}
              showUp={index !== 0}
              showDown={index !== state.length - 1}
            />
          );
        case 'text':
          return (
            <CustomTextInput
              prompt={entry.prompt}
              error={entry.error}
              helperText={entry.helperText}
              handleChange={handleChange}
              index={index}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
              autoFocus={focus === index}
              moveUpButton={moveUpButton(index)}
              moveDownButton={moveDownButton(index)}
              showUp={index !== 0}
              showDown={index !== state.length - 1}
            />
          );
        default:
          return null;
      }
    });
    setFormSteps(steps);
  }, [state, update, shouldUpdate]);

  React.useEffect(() => {
    setFormEntry(<CustomFormEntry getSteps={() => state} disabled={!editEnabled} />);
  }, [state]);

  const toolbar = (
    <>
      {mode === 'editing' && <PreviewButton onClick={() => setMode('preview')} message="Preview" />}
      {mode === 'preview' && <EditPopoverIcon onClick={() => setMode('editing')} message="Edit" />}
    </>
  );

  return (
    <>
      <div style={{ margin: 'auto', justifyContents: 'center' }}>
        {editEnabled && toolbar}
        <div className="mb-5" style={{ margin: 'auto', width: '50vw' }}>
          {mode === 'editing' && formSteps}
          {mode === 'preview' && formEntry}
        </div>

        {/* <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button> */}
      </div>
    </>
  );
}
