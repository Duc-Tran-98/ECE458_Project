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

export default function VerticalLinearStepper({
  getSteps,
  getStepContent,
  onFinish,
  canAdvance,
  showResetBtn,
  finishMsg,
  forceReset,
  handleRestart,
  onNext,
  onBack,
}) {
  VerticalLinearStepper.propTypes = {
    getSteps: PropTypes.func.isRequired, // return array of step titles
    getStepContent: PropTypes.func.isRequired, // function that decides what to display in each step
    onFinish: PropTypes.func.isRequired, // callback fired when all steps complete
    canAdvance: PropTypes.func, // function that decides if user can go on to next step; optional
    showResetBtn: PropTypes.bool, // whether or not the reset button should be displayed at the end of the wizard
    finishMsg: PropTypes.string, // the message to display after finishing all the steps; optional
    forceReset: PropTypes.bool, // whehter or not the user inputed an error and should be prompted a restart button
    handleRestart: PropTypes.func, // callback fired when the restart button is clicked
    onNext: PropTypes.func,
    onBack: PropTypes.func,
  };
  VerticalLinearStepper.defaultProps = {
    showResetBtn: false,
    canAdvance: () => true,
    finishMsg: "All steps completed - you're finished",
    forceReset: false,
    handleRestart: () => undefined,
    onNext: () => undefined,
    onBack: () => undefined,
  };
  // const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0); // state that manages our current step
  const [canShow, setShow] = React.useState(false); // state used to add some delay before displaying so default props can take hold
  React.useEffect(() => {
    let active = true;
    (() => {
      if (active) {
        setShow(true); // on mount, render component
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const steps = getSteps();

  const handleNext = () => { // handle clicking on the next button
    if (canAdvance(activeStep)) {
      setTimeout(() => $('#nextbtn').removeAttr('disabled'), 500);
      $('#nextbtn').attr('disabled', 'disabled');
      console.log($('#nextbtn'));
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      if (onNext !== undefined) { onNext(activeStep); }
      if (activeStep === steps.length - 1) {
        onFinish();
      }
    }
  };

  const handleBack = () => { // handle clicking on the back button
    if (onBack !== undefined) { onBack(activeStep); }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => { // handle the reset button click event
    setActiveStep(0);
  };

  const canClickNext = canAdvance(activeStep);

  const nextOrResetBtn = forceReset ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        if (typeof handleRestart !== 'undefined') {
          handleRestart();
        }
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

  return (
    <div>
      {canShow && (
        <>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            className="rounded p-4"
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {getStepContent(index)}
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
      )}
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
