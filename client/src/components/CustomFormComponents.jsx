import React from 'react';
import Form from 'react-bootstrap/Form';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { CustomFormDeletePopOver } from './CustomMuiIcons';

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
    width: '90%',
    lineHight: '20px',
    fontSize: '25px',
  },
  textFieldLarge: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
  },
  textFieldMedium: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '40%',
  },
  textFieldSmall: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '20%',
  },
  textFieldNumber: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '10%',
  },
}));

const customFormBoxClass = 'customFormBasicBox';

export function CustomHeaderInput({
  header, index, handleChange, handleDelete, showDelete, addButton,
}) {
  CustomHeaderInput.propTypes = {
    header: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
  };
  const classes = useStyles();
  return (
    <div className={customFormBoxClass}>
      {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      {addButton}
      <TextField
        label="Header"
        id="custom-form-header"
        className={classes.textFieldHeader}
        autoFocus
        margin="normal"
        name="prompt"
        onChange={(e) => handleChange(e, index)}
        value={header}
      />
    </div>
  );
}

export function CustomUserPromptInput({
  userPrompt, index, handleChange, handleDelete, showDelete, addButton,
}) {
  CustomUserPromptInput.propTypes = {
    userPrompt: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
  };
  const classes = useStyles();
  return (
    <div className={customFormBoxClass}>
      {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      {addButton}
      <TextField
        label="User Prompt"
        className={classes.textFieldLarge}
        autoFocus
        margin="normal"
        name="prompt"
        onChange={(e) => handleChange(e, index)}
        value={userPrompt}
        multiline
        rows={1}
        rowsMax={100}
      />
    </div>
  );
}

export function CustomNumericInput({
  prompt, min, max, handleChange, index, handleDelete, showDelete, addButton,
}) {
  CustomNumericInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
  };
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedMin: false,
    checkedMax: false,
  });

  const handleChecked = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className={`${customFormBoxClass}`}>
      {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      {addButton}
      <TextField
        label="Numeric input label"
        className={classes.textFieldMedium}
        margin="normal"
        name="prompt"
        type="text"
        onChange={(e) => handleChange(e, index)}
        value={prompt}
        autoFocus
        multiline
        rowsMax={4}
      />
      {/* <span style={{ display: 'flex', flexDirection: 'column' }} className="col"> */}
      <FormControlLabel
        control={(
          <Switch
            checked={state.checkedMin}
            onChange={handleChecked}
            name="checkedMin"
            color="primary"
            size="small"
          />
        )}
        label="Min"
      />
      <FormControlLabel
        control={(
          <Switch
            checked={state.checkedMax}
            onChange={handleChecked}
            name="checkedMax"
            color="primary"
            size="small"
          />
        )}
        label="Max"
      />
      {/* </span> */}

      {state.checkedMin
      && (
      <TextField
        label="Min"
        className={classes.textFieldNumber}
        margin="normal"
        name="min"
        type="number"
        onChange={(e) => handleChange(e, index)}
        value={min}
      />
      )}
      {state.checkedMax
      && (
      <TextField
        label="Max"
        className={classes.textFieldNumber}
        margin="normal"
        name="max"
        type="number"
        onChange={(e) => handleChange(e, index)}
        value={max}
      />
      )}
    </div>
  );
}

export function CustomTextInput({
  prompt, handleChange, index, handleDelete, showDelete, addButton,
}) {
  CustomTextInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
  };
  const classes = useStyles();

  return (
    <div className={customFormBoxClass}>
      {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      {addButton}
      <TextField
        label="Text input label"
        id="margin-normal"
        className={classes.textFieldMedium}
        margin="normal"
        type="text"
        name="prompt"
        onChange={(e) => handleChange(e, index)}
        value={prompt}
        autoFocus
      />
    </div>
  );
}
