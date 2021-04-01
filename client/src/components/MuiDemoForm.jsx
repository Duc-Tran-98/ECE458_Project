import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';

const useStylesText = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textFieldLarge: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100ch',
  },
  textFieldMedium: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '50ch',
  },
  textFieldSmall: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '20ch',
  },
}));

const emptyForm = {
  header: '',
  plaintext: '',
  numeric: false,
  numericLabel: '',
  low: 0,
  high: 0,
  text: false,
  textLabel: '',
};

export default function MuiDemoForm({ editing }) {
  MuiDemoForm.propTypes = {
    editing: PropTypes.bool.isRequired,
  };
  const classes = useStylesText();
  const errors = {
    header: false,
  };

  const [state, setState] = React.useState(emptyForm);
  // TODO: Update low and high to floats (from text)
  const handleSubmit = () => {
    console.log('submitting form with state: ');
    console.log(state);
  };
  const handleTextChange = (event) => {
    console.log(`changeHandler ${event.target.name} --> ${event.target.value}`);
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
    console.log(state);
  };
  const handleCheckedChange = (event) => {
    console.log(`changeHandler ${event.target.name} --> ${event.target.checked}`);
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
    console.log(state);
  };

  return (
    <>
      <div className={classes.root}>
        <TextField
          label="Header"
          id="standard-full-width"
          className={classes.textFieldLarge}
          autoFocus
          disabled={!editing}
          fullWidth
          margin="normal"
          name="header"
          error={errors.header}
          onChange={handleTextChange}
          value={state.header}
        />
        <TextField
          label="User prompt"
          id="margin-normal"
          className={classes.textFieldLarge}
          disabled={!editing}
          margin="normal"
          onChange={handleTextChange}
          name="plaintext"
          value={state.plaintext}
          multiline
          rows={4}
          rowsMax={4}
        />

      </div>
      <div className="m-2">
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={state.numeric} onChange={handleCheckedChange} name="numeric" color="primary" />}
            label="Numeric"
          />
          {state.numeric
          && (
          <>
            <TextField
              label="Label"
              id="margin-normal"
              className={classes.textFieldSmall}
              disabled={!editing}
              margin="normal"
              name="numericLabel"
              type="text"
              onChange={handleTextChange}
              value={state.numericLabel}
            />
            <TextField
              label="Min"
              id="margin-normal"
              className={classes.textFieldSmall}
              disabled={!editing}
              margin="normal"
              name="low"
              type="number"
              onChange={handleTextChange}
              value={state.low}
            />
            <TextField
              label="Max"
              id="margin-normal"
              className={classes.textFieldSmall}
              disabled={!editing}
              margin="normal"
              name="high"
              type="number"
              onChange={handleTextChange}
              value={state.high}
            />
          </>
          )}
        </FormGroup>
      </div>
      <div className="m-2">
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={state.text} onChange={handleCheckedChange} name="text" color="primary" />}
            label="Text"
          />
          {state.text
          && (
            <TextField
              label="Text Label"
              id="margin-normal"
              className={classes.textFieldMedium}
              disabled={!editing}
              margin="normal"
              type="text"
              name="textLabel"
              onChange={handleTextChange}
              value={state.textLabel}
            />
          )}
        </FormGroup>
      </div>
      <button type="submit" className="btn" onClick={handleSubmit}>Submit</button>
    </>
  );
}

const useStylesInput = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export function MuiInputsDemo() {
  const classes = useStylesInput();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Input defaultValue="Hello world" inputProps={{ 'aria-label': 'description' }} />
      <Input placeholder="Placeholder" inputProps={{ 'aria-label': 'description' }} />
      <Input defaultValue="Disabled" disabled inputProps={{ 'aria-label': 'description' }} />
      <Input defaultValue="Error" error inputProps={{ 'aria-label': 'description' }} />
    </form>
  );
}
