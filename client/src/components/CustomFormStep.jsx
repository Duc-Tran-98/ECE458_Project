import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { PopOverFragment } from './PopOver';

const useStylesText = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textFieldHeader: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100ch',
    lineHight: '20px',
    fontSize: '25px',
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
  id, state, updateState, createStep, deleteStep,
}) {
  CustomFormStep.propTypes = {
    id: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    createStep: PropTypes.func.isRequired,
    deleteStep: PropTypes.func.isRequired,
  };
  const classes = useStylesText();
  const [errors, setErrors] = React.useState({
    low: false,
    lowMessage: '',
    high: false,
    highMessage: '',
  });

  const handleChange = (event, value) => {
    updateState(id, event, value);
  };
  const resetErrors = () => {
    console.log('resetting errors');
    setErrors({
      ...errors,
      low: false,
      lowMessage: '',
      high: false,
      highMessage: '',
    });
  };
  const emptyNumber = (value) => value === 0 || value === null || value === '';
  // FIXME: Known bug, 'e' is accepted as part of number
  // Tried text, regex match, etc. but getting strange behavior
  // Come back if time
  const handleChangeNumber = (type, event, value) => {
    console.log(`handleChangeNumber(${event}, ${value})`);
    const intValue = Number.isNaN(parseInt(value, 10)) ? value : parseInt(value, 10);
    const lowExists = !emptyNumber(state.low) || type === 'low';
    const highExists = !emptyNumber(state.high) || type === 'high';

    // State update takes time, use current value
    const low = (type === 'low') ? intValue : state.low;
    const high = (type === 'high') ? intValue : state.high;

    handleChange(event, intValue);
    if (highExists && lowExists) {
      console.log('both numbers present');
      // Both numbers present, validate both
      if (low >= high) {
        console.log('low >= high, setting errors');
        setErrors({
          low: true,
          lowMessage: 'Invalid min',
          high: true,
          highMessage: 'Invalid max',
        });
      } else {
        resetErrors();
      }
    } else {
      // Both not present, fine to have single bound
      resetErrors();
    }

    // if (!value.includes('e')) {
    //   handleChange(event, value);
    // }
    // const regex = new RegExp('^[+-]?\\d+(\\.\\d+)?$');
    // if (regex.test(value) || value === '') {
    //   console.log('regex passed');
    //   handleChange(event, value);
    // }
  };

  return (
    <div className="customFormBox">
      <div className={classes.root}>
        <TextField
          label="Header"
          id="custom-form-header"
          className={classes.textFieldHeader}
          autoFocus
          fullWidth
          margin="normal"
          name="header"
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
              className={classes.textFieldSmall}
              margin="normal"
              name="numericLabel"
              type="text"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              value={state.numericLabel}
            />
            <TextField
              label="Min"
              className={classes.textFieldSmall}
              margin="normal"
              name="low"
              type="number"
              onChange={(e) => handleChangeNumber('low', e.target.name, e.target.value)}
              value={state.low}
              error={errors.low}
              helperText={errors.lowMessage}
            />
            <TextField
              label="Max"
              className={classes.textFieldSmall}
              margin="normal"
              name="high"
              type="number"
              onChange={(e) => handleChangeNumber('high', e.target.name, e.target.value)}
              value={state.high}
              error={errors.high}
              helperText={errors.highMessage}
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
      <PopOverFragment message="Add Step">
        <IconButton onClick={() => createStep(id)}>
          <AddCircleIcon style={{ color: '#11fc85' }} />
        </IconButton>
      </PopOverFragment>
      <PopOverFragment message="Delete Step">
        <IconButton onClick={() => deleteStep(id)}>
          <DeleteIcon style={{ color: '#fc2311' }} />
        </IconButton>
      </PopOverFragment>
    </div>
  );
}
