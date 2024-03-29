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
import $ from 'jquery';
import CustomFormWizardStep from './CustomFormWizardStep';

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

  const handleBack = () => { // handle clicking on the back button
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => { // handle the reset button click event
    setActiveStep(0);
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
                <CustomFormWizardStep
                  formStep={formStep}
                  handleBack={handleBack}
                  handleNext={handleNext}
                  handleReset={handleReset}
                  lastStep={activeStep === steps.length - 1}
                  firstStep={activeStep === 0}
                />
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
