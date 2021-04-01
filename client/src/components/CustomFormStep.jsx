import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
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

export default function CustomFormStep({
  id, state, updateState, addButton, deleteButton,
}) {
  CustomFormStep.propTypes = {
    id: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    addButton: PropTypes.node.isRequired,
    deleteButton: PropTypes.node.isRequired,
  };
  const classes = useStylesText();
  const errors = {
    header: false,
  };

  // TODO: Update low and high to floats (from text)
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = () => {
    console.log('submitting form with state: ');
    console.log(state);
  };
  const handleChange = (event, value) => {
    updateState(id, event, value);
  };

  return (
    <div className="m-5">
      <div className="customFormBox">
        <div className={classes.root}>
          <TextField
            label="Header"
            id="standard-full-width"
            className={classes.textFieldLarge}
            autoFocus
            fullWidth
            margin="normal"
            name="header"
            error={errors.header}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            value={state.header}
          />
          <TextField
            label="User prompt"
            id="margin-normal"
            className={classes.textFieldLarge}
            margin="normal"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
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
              control={(
                <Switch
                  checked={state.numeric}
                  onChange={(e) => handleChange(e.target.name, e.target.checked)}
                  name="numeric"
                  color="primary"
                />
              )}
              label="Numeric"
            />
            {state.numeric
          && (
          <>
            <TextField
              label="Label"
              id="margin-normal"
              className={classes.textFieldSmall}
              margin="normal"
              name="numericLabel"
              type="text"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              value={state.numericLabel}
            />
            <TextField
              label="Min"
              id="margin-normal"
              className={classes.textFieldSmall}
              margin="normal"
              name="low"
              type="number"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              value={state.low}
            />
            <TextField
              label="Max"
              id="margin-normal"
              className={classes.textFieldSmall}
              margin="normal"
              name="high"
              type="number"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              value={state.high}
            />
          </>
          )}
          </FormGroup>
        </div>
        <div className="m-2">
          <FormGroup row>
            <FormControlLabel
              control={(
                <Switch
                  checked={state.text}
                  onChange={(e) => handleChange(e.target.name, e.target.checked)}
                  name="text"
                  color="primary"
                />
              )}
              label="Text"
            />
            {state.text
          && (
            <TextField
              label="Text Label"
              id="margin-normal"
              className={classes.textFieldMedium}
              margin="normal"
              type="text"
              name="textLabel"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              value={state.textLabel}
            />
          )}
          </FormGroup>
        </div>
        {/* <button type="submit" className="btn" onClick={handleSubmit}>Submit</button> */}
        {addButton}
        {deleteButton}
      </div>
    </div>
  );
}
