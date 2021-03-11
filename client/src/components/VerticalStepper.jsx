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

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//   },
//   button: {
//     marginTop: theme.spacing(1),
//     marginRight: theme.spacing(1),
//   },
//   actionsContainer: {
//     marginBottom: theme.spacing(2),
//   },
//   resetContainer: {
//     padding: theme.spacing(3),
//   },
// }));

// function getSteps() {
//   return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
// }

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return `For each ad campaign that you create, you can control how much
//               you're willing to spend on clicks and conversions, which networks
//               and geographical locations you want your ads to show on, and more.`;
//     case 1:
//       return 'An ad group contains one or more ads which target a shared set of keywords.';
//     case 2:
//       return `Try out different ad text to see what brings in the most customers,
//               and learn how to enhance your ads using features like ad extensions.
//               If you run into any problems with your ads, find out how to tell if
//               they're running and how to resolve approval issues.`;
//     default:
//       return 'Unknown step';
//   }
// }

export default function VerticalLinearStepper({
  getSteps,
  getStepContent,
  onFinish,
  canAdvance,
  showResetBtn,
  finishMsg,
  forceReset,
  handleRestart,
}) {
  VerticalLinearStepper.propTypes = {
    getSteps: PropTypes.func.isRequired,
    getStepContent: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    canAdvance: PropTypes.func,
    showResetBtn: PropTypes.bool,
    finishMsg: PropTypes.string,
    forceReset: PropTypes.bool,
    handleRestart: PropTypes.func,
  };
  VerticalLinearStepper.defaultProps = {
    showResetBtn: false,
    canAdvance: () => true,
    finishMsg: "All steps completed - you're finished",
    forceReset: false,
    handleRestart: () => undefined,
  };
  // const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [canShow, setShow] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    (() => {
      if (active) {
        setShow(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const steps = getSteps();

  const handleNext = () => {
    if (canAdvance(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      if (activeStep === steps.length - 1) {
        onFinish();
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
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
