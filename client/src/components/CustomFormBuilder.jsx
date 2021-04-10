/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  PreviewButton, EditPopoverIcon, MuiSaveButton, TitlePopoverIcon, TextFieldPopoverIcon, NumberInputPopoverIcon,
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
  handleSave, state, setState, update,
}) {
  CustomFormBuilder.propTypes = {
    handleSave: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    update: PropTypes.number.isRequired, // force updates on error handling
  };

  const [formSteps, setFormSteps] = React.useState([]);
  const [formEntry, setFormEntry] = React.useState();
  const [mode, setMode] = React.useState('editing');
  const [focus, setFocus] = React.useState(0); // index of element to focus on

  const handleSubmit = () => {
    handleSave(JSON.stringify(state));
  };
  const handleChange = (e, index) => {
    const nextState = [...state];
    nextState[index] = {
      ...nextState[index],
      [e.target.name]: e.target.value,
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
            />
          );
        case 'number':
          return (
            <CustomNumericInput
              prompt={entry.prompt}
              error={entry.error}
              helperText={entry.helperText}
              min={entry.min}
              max={entry.max}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
              autoFocus={focus === index}
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
            />
          );
        default:
          return null;
      }
    });
    setFormSteps(steps);
  }, [state, update]);

  React.useEffect(() => {
    setFormEntry(<CustomFormEntry getSteps={() => state} handleSubmit={() => alert('just finished')} />);
  }, [state]);

  // TODO: Add useEffect to assign error values on state changes
  // These are currently lifted into model form (must check errors there?)
  // IDEA: Iter through, depending on type assign errors
  // Nonexistant labels are errors (on submit)
  // Min/Max are errors if value

  return (
    <>
      <div style={{ margin: 'auto', justifyContents: 'center' }}>
        <div className="m-4">
          {/* {toolbar} */}
          {mode === 'editing' && <PreviewButton onClick={() => setMode('preview')} message="Preview" />}
          {mode === 'preview' && <EditPopoverIcon onClick={() => setMode('editing')} message="Edit" />}
          <MuiSaveButton onClick={handleSubmit} color="primary" />
        </div>
        <div className="mb-5" style={{ margin: 'auto', width: '50vw' }}>
          {mode === 'editing' && formSteps}
          {mode === 'preview' && formEntry}
        </div>

        {/* <button type="submit" className="btn" onClick={handleSubmit}>Review Form</button> */}
      </div>
    </>
  );
}
