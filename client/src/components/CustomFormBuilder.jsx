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

export default function CustomFormBuilder({ handleSave }) {
  CustomFormBuilder.propTypes = {
    handleSave: PropTypes.func.isRequired,
  };
  const emptyHeader = {
    type: 'header',
    prompt: '',
  };
  const emptyDescription = {
    type: 'description',
    prompt: '',
  };
  const emptyNumericInput = {
    type: 'number',
    prompt: '',
    value: 0,
    min: 0,
    max: 0,
    errors: false,
    helperText: '',
  };
  const emptyTextInput = {
    type: 'text',
    prompt: '',
    value: '',
    errors: false,
    helperText: '',
  };
  const initState = { ...emptyHeader };
  const [state, setState] = React.useState([initState]);
  const [formSteps, setFormSteps] = React.useState([]);
  const [formEntry, setFormEntry] = React.useState();
  const [mode, setMode] = React.useState('editing');

  const handleSubmit = () => {
    handleSave(JSON.stringify(state));
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
  const handleChange = (e, index) => {
    console.log(`handleChange(${e.target.name}, ${e.target.value}, ${index})`);
    const nextState = [...state];
    nextState[index] = {
      ...nextState[index],
      [e.target.name]: e.target.value,
    };
    console.log(nextState);
    setState(nextState);
  };
  const createStep = (index) => {
    const prevState = [...state];
    prevState.splice(index + 1, 0, ...emptyHeader);
    setState(prevState);
  };
  const deleteStep = (index) => {
    console.log(`deleteStep with id: ${index}\tprevState, nextState`);
    if (state.length > 1) {
      const prevState = [...state];
      const nextState = prevState.filter((item, i) => index !== i);
      console.log(prevState);
      console.log(nextState);
      setState(nextState);
    }
  };

  const addElement = (type, index) => {
    const insertIndex = index || state.length;
    console.log(`addElement(${type}, ${index}, ${insertIndex})`);
    let obj = { ...emptyHeader };
    // eslint-disable-next-line default-case
    switch (type) {
      case 'header':
        console.log('found header');
        obj = { ...emptyHeader };
        break;
      case 'description':
        console.log('found description');
        obj = { ...emptyDescription };
        break;
      case 'number':
        console.log('found number');
        obj = { ...emptyNumericInput };
        break;
      case 'text':
        console.log('found text');
        obj = { ...emptyTextInput };
        break;
    }
    console.log('adding obj:');
    console.log(obj);
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

  // const toolbar = (
  //   <>
  //     <span>
  //       <TitlePopoverIcon message="Add Header" onClick={() => addElement('header')} />
  //       <TitlePopoverIcon message="Add User Prompt" onClick={() => addElement('description')} />
  //       <NumberInputPopoverIcon message="Add Numeric Input" onClick={() => addElement('number')} />
  //       <TextFieldPopoverIcon message="Add Text Input" onClick={() => addElement('text')} />
  //     </span>
  //   </>
  // );

  React.useEffect(() => {
    const steps = state.map((entry, index) => {
      switch (entry.type) {
        case 'header':
          return (
            <CustomHeaderInput
              header={entry.prompt}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
            />
          );
        case 'description':
          return (
            <CustomUserPromptInput
              userPrompt={entry.prompt}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
            />
          );
        case 'number':
          return (
            <CustomNumericInput
              prompt={entry.prompt}
              min={entry.min}
              max={entry.max}
              index={index}
              handleChange={handleChange}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
            />
          );
        case 'text':
          return (
            <CustomTextInput
              prompt={entry.prompt}
              handleChange={handleChange}
              index={index}
              handleDelete={deleteStep}
              showDelete={state.length > 1}
              addButton={addButton(index)}
            />
          );
        default:
          return null;
      }
    });
    setFormSteps(steps);
  }, [state]);

  React.useEffect(() => {
    setFormEntry(<CustomFormEntry getSteps={() => state} handleSubmit={() => alert('just finished')} />);
  }, [state]);

  // TODO: Add useEffect to assign error values on state changes
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
