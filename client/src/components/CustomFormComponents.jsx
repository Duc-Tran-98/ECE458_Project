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
  header, index, handleChange, handleDelete, showDelete, addButton, autoFocus, error, helperText, moveUpButton, moveDownButton, showUp, showDown,
}) {
  CustomHeaderInput.propTypes = {
    header: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    helperText: PropTypes.string.isRequired,
    moveUpButton: PropTypes.node.isRequired,
    moveDownButton: PropTypes.node.isRequired,
    showUp: PropTypes.bool.isRequired,
    showDown: PropTypes.bool.isRequired,
  };
  const classes = useStyles();
  return (
    <div className={`${customFormBoxClass} row`}>
      <div className="col-auto" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {showUp && moveUpButton}
        {showDown && moveDownButton}
      </div>
      <div className="col-auto" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {addButton}
        {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      </div>
      <div className="col">
        {/* trigger re render anytime error changes */}
        <TextField
          label="Header"
          id="custom-form-header"
          className={classes.textFieldHeader}
          autoFocus={autoFocus}
          margin="normal"
          name="prompt"
          onChange={(e) => handleChange(e, index)}
          value={header}
          error={error}
          helperText={helperText}
          multiline
          rowsMax={4}
        />
      </div>
    </div>
  );
}

export function CustomUserPromptInput({
  userPrompt, index, handleChange, handleDelete, showDelete, addButton, autoFocus, error, helperText, moveUpButton, moveDownButton, showUp, showDown,
}) {
  CustomUserPromptInput.propTypes = {
    userPrompt: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    helperText: PropTypes.string.isRequired,
    moveUpButton: PropTypes.node.isRequired,
    moveDownButton: PropTypes.node.isRequired,
    showUp: PropTypes.bool.isRequired,
    showDown: PropTypes.bool.isRequired,
  };
  const classes = useStyles();
  return (
    <div className={`${customFormBoxClass} row`}>
      <div className="col-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {showUp && moveUpButton}
        {showDown && moveDownButton}
      </div>
      <div className="col-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {addButton}
        {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      </div>
      <div className="col">
        <TextField
          label="User prompt"
          className={classes.textFieldLarge}
          autoFocus={autoFocus}
          margin="normal"
          name="prompt"
          onChange={(e) => handleChange(e, index)}
          value={userPrompt}
          multiline
          rows={1}
          rowsMax={100}
          error={error}
          helperText={helperText}
        />
      </div>
    </div>
  );
}

export function CustomNumericInput({
  prompt, min, max, minSet, maxSet, minError, minHelperText, maxError, maxHelperText, handleChecked, handleChange, index, handleDelete, showDelete, addButton, autoFocus, error, helperText, moveUpButton, moveDownButton, showUp, showDown,
}) {
  CustomNumericInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    minSet: PropTypes.bool.isRequired,
    maxSet: PropTypes.bool.isRequired,
    minError: PropTypes.bool.isRequired,
    minHelperText: PropTypes.string.isRequired,
    maxError: PropTypes.bool.isRequired,
    maxHelperText: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    handleChecked: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    helperText: PropTypes.string.isRequired,
    moveUpButton: PropTypes.node.isRequired,
    moveDownButton: PropTypes.node.isRequired,
    showUp: PropTypes.bool.isRequired,
    showDown: PropTypes.bool.isRequired,
  };
  const classes = useStyles();
  return (
    <div className={`${customFormBoxClass} row`}>
      <div className="col-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {showUp && moveUpButton}
        {showDown && moveDownButton}
      </div>
      <div className="col-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {addButton}
        {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      </div>
      <div className="col">
        <div className="row">
          <TextField
            label="Numeric input label"
            className={classes.textFieldMedium}
            margin="normal"
            name="prompt"
            type="text"
            onChange={(e) => handleChange(e, index)}
            value={prompt}
            autoFocus={autoFocus}
            multiline
            rowsMax={4}
            error={error}
            helperText={helperText}
          />
          <div className="col-sm-auto mt-3">
            <div className="row">
              <FormControlLabel
                control={(
                  <Switch
                    checked={minSet}
                    onChange={(e) => handleChecked(e, index)}
                    name="minSet"
                    color="primary"
                    size="small"
                  />
        )}
                label="Min"
              />
            </div>
            <div className="row">
              <FormControlLabel
                control={(
                  <Switch
                    checked={maxSet}
                    onChange={(e) => handleChecked(e, index)}
                    name="maxSet"
                    color="primary"
                    size="small"
                  />
        )}
                label="Max"
              />
            </div>
          </div>

          {minSet
      && (
      <TextField
        label="Min"
        className={classes.textFieldNumber}
        margin="normal"
        name="min"
        type="number"
        onChange={(e) => handleChange(e, index)}
        value={min}
        error={minError}
        helperText={minHelperText}
      />
      )}
          {maxSet
      && (
      <TextField
        label="Max"
        className={classes.textFieldNumber}
        margin="normal"
        name="max"
        type="number"
        onChange={(e) => handleChange(e, index)}
        value={max}
        error={maxError}
        helperText={maxHelperText}
      />
      )}
        </div>
      </div>
    </div>
  );
}

export function CustomTextInput({
  prompt, handleChange, index, handleDelete, showDelete, addButton, autoFocus, error, helperText, moveUpButton, moveDownButton, showUp, showDown,
}) {
  CustomTextInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired,
    addButton: PropTypes.node.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    helperText: PropTypes.string.isRequired,
    moveUpButton: PropTypes.node.isRequired,
    moveDownButton: PropTypes.node.isRequired,
    showUp: PropTypes.bool.isRequired,
    showDown: PropTypes.bool.isRequired,
  };
  const classes = useStyles();

  return (
    <div className={`${customFormBoxClass} row`}>
      <div className="col-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {showUp && moveUpButton}
        {showDown && moveDownButton}
      </div>
      <div className="col-1" style={{ display: 'flex', flexDirection: 'column', maxWidth: '5%' }}>
        {addButton}
        {showDelete && <CustomFormDeletePopOver title="Delete" onClick={() => handleDelete(index)} />}
      </div>
      <div className="col">
        <TextField
          label="Text input label"
          id="margin-normal"
          className={classes.textFieldLarge}
          margin="normal"
          type="text"
          name="prompt"
          onChange={(e) => handleChange(e, index)}
          value={prompt}
          autoFocus={autoFocus}
          error={error}
          helperText={helperText}
          multiline
          rowsMax={10}
        />
      </div>
    </div>
  );
}
