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
  getSteps, handleSubmit,
}) {
  CustomFormEntry.propTypes = {
    getSteps: PropTypes.func.isRequired, // return array of steps JSON
    handleSubmit: PropTypes.func.isRequired,
  };

  const classes = useStyles();
  const steps = getSteps();
  console.log('Creating CustomFormWizard with steps: ');
  console.log(steps);

  const headerStep = (step) => (
    <TextField
      id="custom-form-header"
      className={classes.textFieldHeader}
      margin="normal"
      name="prompt"
      value={step.prompt}
      disabled
      InputProps={{ disableUnderline: true }}
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
      InputProps={{ disableUnderline: true }}
    />
  );

  const numberStep = (step) => (
    <>
      <p>{`${step.prompt} between ${step.min} and ${step.max}`}</p>
      <input />
    </>
  );
  const textStep = (step) => (
    <>
      <p>{step.prompt}</p>
      <input />
    </>
  );

  const formEntrySteps = steps.map((step) => {
    switch (step.type) {
      case 'header':
        return headerStep(step);
      case 'description':
        return descriptionStep(step);
      case 'number':
        return numberStep(step);
      case 'text':
        return textStep(step);
      default:
        return null;
    }
  });

  return (
    <div>
      {formEntrySteps}
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
