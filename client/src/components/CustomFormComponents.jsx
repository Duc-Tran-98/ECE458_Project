import React from 'react';
import Form from 'react-bootstrap/Form';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

// eslint-disable-next-line import/prefer-default-export
export const CustomInput = ({
  // eslint-disable-next-line react/prop-types
  controlId, className, label, name, type, required, value, onChange, disabled, isInvalid, error, placeHolder,
}) => (
  <>
    <Form.Group controlId={controlId}>
      <Form.Label className={className}>{label}</Form.Label>
      <Form.Control
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        isInvalid={isInvalid}
        placeholder={placeHolder}
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  </>
);

export const CustomButton = ({
  // eslint-disable-next-line react/prop-types
  onClick, divClass, buttonClass, buttonLabel,
}) => (
  <div className={divClass}>
    <button type="button" className={buttonClass} onClick={onClick}>
      {buttonLabel}
    </button>
  </div>
);

/**
 * The following several components are used in the CustomForm builder
 * They are all controlled components, and solely render information from the parent component
 * Many of these will be used to compose the custom form builder
 */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textFieldHeader: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '50vw',
    lineHight: '20px',
    fontSize: '25px',
  },
  textFieldLarge: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '50vw',
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

export function CustomHeaderInput({ header, index, handleChange }) {
  CustomHeaderInput.propTypes = {
    header: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
  };
  const classes = useStyles();
  return (
    <TextField
      label="Header"
      className={classes.textFieldHeader}
      autoFocus
      fullWidth
      margin="normal"
      name="prompt"
      onChange={(e) => handleChange(e, index)}
      value={header}
      style={{ fontSize: '2rem!important' }}
    />
  );
}

export function CustomUserPromptInput({ userPrompt, index, handleChange }) {
  CustomUserPromptInput.propTypes = {
    userPrompt: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
  };
  const classes = useStyles();
  return (
    <TextField
      label="User Prompt"
      className={classes.textFieldLarge}
      autoFocus
      fullWidth
      margin="normal"
      name="prompt"
      onChange={(e) => handleChange(e, index)}
      value={userPrompt}
      multiline
      rows={4}
      rowsMax={4}
    />
  );
}

export function CustomNumericInput({
  prompt, min, max, handleChange, index,
}) {
  CustomNumericInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };
  const classes = useStyles();

  return (
    <>
      <TextField
        label="Label"
        className={classes.textFieldSmall}
        margin="normal"
        name="prompt"
        type="text"
        onChange={(e) => handleChange(e, index)}
        value={prompt}
        autoFocus
      />
      <TextField
        label="Min"
        className={classes.textFieldSmall}
        margin="normal"
        name="min"
        type="number"
        onChange={(e) => handleChange(e, index)}
        value={min}
        // error={errors.low}
        // helperText={errors.lowMessage}
      />
      <TextField
        label="Max"
        className={classes.textFieldSmall}
        margin="normal"
        name="max"
        type="number"
        onChange={(e) => handleChange(e, index)}
        value={max}
        // error={errors.high}
        // helperText={errors.highMessage}
      />
    </>
  );
}

export function CustomTextInput({ prompt, handleChange, index }) {
  CustomTextInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };
  const classes = useStyles();

  return (
    <TextField
      label="Text Label"
      id="margin-normal"
      className={classes.textFieldMedium}
      margin="normal"
      type="text"
      name="prompt"
      onChange={(e) => handleChange(e, index)}
      value={prompt}
      autoFocus
    />
  );
}
