import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import $ from 'jquery';

// TODO: Implement me (with JSON dump as only prop, parse steps from there)
export default function CustomFormWizard({
  getSteps, onFinish,
}) {
  CustomFormWizard.propTypes = {
    getSteps: PropTypes.func.isRequired, // return array of steps JSON
    onFinish: PropTypes.func.isRequired,
  };
  // const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0); // state that manages our current step
  const steps = getSteps();
  console.log('Creating CustomFormWizard with steps: ');
  console.log(steps);
  const forceReset = false;
  const finishMsg = 'Completing custom form calibration';
  const showResetBtn = false;

  const handleNext = () => { // handle clicking on the next button
    // if (canAdvance(activeStep)) {
    setTimeout(() => $('#nextbtn').removeAttr('disabled'), 500);
    $('#nextbtn').attr('disabled', 'disabled');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      onFinish();
    }
    // }
  };
  const canClickNext = true; // canAdvance(activeStep);

  const handleBack = () => { // handle clicking on the back button
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => { // handle the reset button click event
    setActiveStep(0);
  };

  const nextOrResetBtn = forceReset ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        handleReset();
      }}
      className="btn"
    >
      Restart
    </Button>
  ) : (
    <Button
      id="nextbtn"
      variant="contained"
      color="primary"
      onClick={handleNext}
      className="btn"
      disabled={!canClickNext}
    >
      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
    </Button>
  );

  const getNumberLabel = (low, high) => {
    if (!low && !high) {
      return '';
    } if (!low) {
      return `less than ${high}`;
    } if (!high) {
      return `greater than ${low}`;
    }
    return `between ${low} and ${high}`;
  };

  const getStepContent = (formStep) => {
    const {
      plaintext,
      numeric,
      numericLabel,
      low,
      high,
      text,
      textLabel,
    } = formStep;

    return (
      <>
        <p>{plaintext}</p>
        {numeric
          && (
          <>
            <p>{`${numericLabel} ${getNumberLabel(low, high)}`}</p>
            <TextField
              label="Measurement"
              id="margin-normal"
              margin="normal"
              name="Measurement"
              type="number"
              // className={classes.textFieldSmall}
              // onChange={(e) => handleChange(e.target.name, e.target.value)}
              // value={state.low}
            />
          </>
          )}
        {text && (
        <>
          <p>{textLabel}</p>
          <TextField
            label="Observation"
            id="margin-normal"
            margin="normal"
            name="Observation"
            type="text"
          />
        </>
        )}

      </>
    );
  };

  return (
    <div className="customFormWizard">
      <>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className="rounded p-4"
        >
          {steps.map((formStep, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Step key={index}>
              <StepLabel>{formStep.header}</StepLabel>
              <StepContent>
                {getStepContent(formStep)}
                <div className="my-2">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className="btn"
                  >
                    Back
                  </Button>
                  <span className="mx-2" />
                  {nextOrResetBtn}
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </>
      {activeStep === steps.length && (
        <Paper square elevation={0} className="p-3">
          <Typography>{finishMsg}</Typography>
          {showResetBtn && (
            <Button onClick={handleReset} className="btn mt-2">
              Reset
            </Button>
          )}
        </Paper>
      )}
    </div>
  );
}
