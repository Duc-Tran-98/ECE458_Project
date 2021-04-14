import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Form from 'react-bootstrap/Form';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import AddCustomFormCalibration from '../queries/AddCustomFormCalibration';
import UserContext from './UserContext';

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
  underline: {
    '&&&:before': {
      borderBottom: 'none',
    },
    '&&:after': {
      borderBottom: 'none',
    },
  },
}));

export default function CustomFormEntry({
  getSteps, modelNumber, vendor, serialNumber, assetTag, onFinish,
}) {
  CustomFormEntry.propTypes = {
    getSteps: PropTypes.func.isRequired, // return array of steps JSON
    modelNumber: PropTypes.string,
    vendor: PropTypes.string,
    serialNumber: PropTypes.string,
    assetTag: PropTypes.number,
    onFinish: PropTypes.func,
  };
  CustomFormEntry.defaultProps = {
    modelNumber: '',
    vendor: '',
    serialNumber: '',
    assetTag: 0,
    onFinish: null,
  };

  const user = React.useContext(UserContext);
  const classes = useStyles();
  const steps = getSteps();
  const [state, setState] = React.useState(steps);
  const [formSteps, setFormSteps] = React.useState(null);
  const [update, setUpdate] = React.useState(0);
  const [checkErrors, setCheckErrors] = React.useState(0);

  const inputProps = { disableUnderline: true };
  const divClass = 'border-top border-dark mt-4';

  const handleResponse = (response) => {
    console.log(response);
    if (response.success) {
      toast.success(response.message);
    }
  };
  const today = new Date().toISOString().split('T')[0]; // TODO: Can this be set?

  const validForm = () => {
    let errorCount = 0;
    const nextState = state;
    state.forEach((element, index) => {
      switch (element.type) {
        case 'number':
          // Validate number present
          if (element.value === '' || Number.isNaN(parseFloat(element.value))) {
            errorCount += 1;
            nextState[index] = {
              ...nextState[index],
              error: true,
              helperText: 'Please enter number',
            };
          } else {
            // console.log(`minSet: ${element.minSet}\tminSet: ${element.maxSet}\telement.value: ${element.value}\tparseFloat(element.value): ${parseFloat(element.value)}`);
            if (element.minSet && parseFloat(element.value) < element.min) {
              errorCount += 1;
              nextState[index] = {
                ...nextState[index],
                error: true,
                helperText: 'Must be greater than min',
              };
            }
            if (element.maxSet && parseFloat(element.value) > element.max) {
              errorCount += 1;
              nextState[index] = {
                ...nextState[index],
                error: true,
                helperText: 'Must be less than max',
              };
            }
          }
          break;
        case 'text':
          // Validate text present
          if (element.value === '') {
            errorCount += 1;
            nextState[index] = {
              ...nextState[index],
              error: true,
              helperText: 'Please make observation',
            };
          }

          break;
        default:
          break;
      }
    });
    setState(nextState);
    setUpdate(update + 1);
    return errorCount === 0;
  };

  // Effect to remove errors and helper text as they are resolved
  React.useEffect(() => {
    const nextState = state;
    state.forEach((element, index) => {
      switch (element.type) {
        case 'number':
          // Validate number present
          if (element.value !== '' && !Number.isNaN(parseFloat(element.value))) {
            nextState[index] = {
              ...nextState[index],
              error: false,
              helperText: '',
            };
          } else {
            if (element.minSet && parseFloat(element.value) >= element.min) {
              nextState[index] = {
                ...nextState[index],
                error: false,
                helperText: '',
              };
            }
            if (element.maxSet && parseFloat(element.value) <= element.max) {
              nextState[index] = {
                ...nextState[index],
                error: false,
                helperText: '',
              };
            }
          }

          break;
        case 'text':
          // Validate text present
          if (element.error && element.value !== '') {
            nextState[index] = {
              ...nextState[index],
              error: false,
              helperText: '',
            };
          }
          break;
        default:
          break;
      }
    });
    setState(nextState);
  }, [checkErrors]);

  const handleSubmit = () => {
    if (!validForm()) {
      toast.error('Invalid fields in form, please fix before submitting', { toastId: -87 });
      return;
    }
    console.log(`submit calib event for\n${modelNumber}\t${vendor}\t${serialNumber}\t${assetTag}`);
    console.log(JSON.stringify(state));
    AddCustomFormCalibration({
      assetTag,
      user: user.userName,
      date: today,
      comment: '',
      customFormData: JSON.stringify(state),
      handleResponse,
    });
    onFinish();
  };
  const canSubmit = true;

  const handleChange = (e, index) => {
    const nextState = state;
    nextState[index] = {
      ...nextState[index],
      value: e.target.value,
    };
    setState(state);
    setUpdate(update + 1);
    setCheckErrors(checkErrors + 1);
  };

  const getNumberLabel = (step) => {
    const {
      minSet, maxSet, min, max,
    } = step;
    if (minSet && maxSet) {
      return `Between ${min} and ${max}`;
    }
    if (minSet) {
      return `Greater than ${min}`;
    }
    if (maxSet) {
      return `Less than ${max}`;
    }
    return '';
  };

  const headerStep = (step) => (
    <TextField
      id="custom-form-header"
      className={classes.textFieldHeader}
      margin="normal"
      name="prompt"
      value={step.prompt}
      disabled
      InputProps={inputProps}
    />
  );

  const descriptionStep = (step) => (
    <TextField
      className={classes.textFieldLarge}
      margin="normal"
      value={step.prompt}
      multiline
      rowsMax={100}
      disabled
      InputProps={inputProps}
    />
  );

  const numberStep = (step, index) => (
    <div className={`${divClass} row`}>
      <div className="col">
        <TextField
          className={classes.textFieldLarge}
          margin="normal"
          value={step.prompt}
          helperText={getNumberLabel(step)}
          disabled
          InputProps={inputProps}
        />
      </div>
      <div className="col" style={{ margin: 'auto 0px' }}>
        <Form.Control
          type="number"
          name="comment"
          value={state[index].value}
          onChange={(e) => handleChange(e, index)}
          isInvalid={!!state[index].error}
          error={state[index].error}
        />
        <Form.Control.Feedback type="invalid">
          {state[index].helperText}
        </Form.Control.Feedback>
      </div>
    </div>
  );
  const textStep = (step, index) => (
    <div className={`${divClass} row`}>
      <div className="col">
        <TextField
          className={classes.textFieldLarge}
          margin="normal"
          value={step.prompt}
          disabled
          InputProps={inputProps}
        />
      </div>
      <div className="col mt-3" style={{ margin: 'auto 0px' }}>
        <Form.Control
          type="text"
          name="comment"
          as="textarea"
          rows={3}
          value={state[index].value}
          onChange={(e) => handleChange(e, index)}
          isInvalid={!!state[index].error}
          error={state[index].error}
        />
        <Form.Control.Feedback type="invalid">
          {state[index].helperText}
        </Form.Control.Feedback>
      </div>
    </div>
  );

  React.useEffect(() => {
    const formEntrySteps = steps.map((step, index) => {
      switch (step.type) {
        case 'header':
          return headerStep(step);
        case 'description':
          return descriptionStep(step);
        case 'number':
          return numberStep(step, index);
        case 'text':
          return textStep(step, index);
        default:
          return null;
      }
    });
    setFormSteps(formEntrySteps);
  }, [state, update]);

  return (
    <div className="customFormEntryBox">
      {formSteps}
      {onFinish !== null && <button type="submit" className="btn" disabled={!canSubmit} onClick={handleSubmit}>Finish</button>}
    </div>
  );
}
