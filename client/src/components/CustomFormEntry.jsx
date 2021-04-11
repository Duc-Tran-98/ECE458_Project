import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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

  // TODO: Add query for this
  const handleSubmit = () => {
    console.log(`submit calib event for\n${modelNumber}\t${vendor}\t${serialNumber}\t${assetTag}`);
    onFinish();
  };
  const canSubmit = false;

  const classes = useStyles();
  const steps = getSteps();
  const [state, setState] = React.useState(steps);
  const [formSteps, setFormSteps] = React.useState(null);
  const [update, setUpdate] = React.useState(0);

  const inputProps = { disableUnderline: true };
  const divClass = 'border-top border-dark mt-3';

  const handleChange = (e, index) => {
    const nextState = state;
    nextState[index] = {
      ...nextState[index],
      value: e.target.value,
    };
    setState(state);
    setUpdate(update + 1);
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
      <div className="col-auto">
        <TextField
          className={classes.textFieldLarge}
          margin="normal"
          value={step.prompt}
          helperText={getNumberLabel(step)}
          disabled
          InputProps={inputProps}
        />
      </div>
      <div className="col">
        <TextField
          className={classes.textFieldSmall}
          margin="normal"
          type="number"
          onChange={(e) => handleChange(e, index)}
          value={state[index].value}
          variant="outlined"
        />
      </div>
    </div>
  );
  const textStep = (step, index) => (
    <div className={`${divClass} row`}>
      <div className="col-auto">
        <TextField
          className={classes.textFieldLarge}
          margin="normal"
          value={step.prompt}
          disabled
          InputProps={inputProps}
        />
      </div>
      <div className="col">
        <TextField
          id="margin-normal"
          className={classes.textFieldMedium}
          margin="normal"
          type="text"
          name="prompt"
          onChange={(e) => handleChange(e, index)}
          value={state[index].value}
          variant="outlined"
        />
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
    <div>
      {formSteps}
      {onFinish !== null && <button type="submit" className="btn" disabled={!canSubmit} onClick={handleSubmit}>Finish</button>}
    </div>
  );
}
