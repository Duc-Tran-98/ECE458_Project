import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

export default function CustomFormWizardStep({
  formStep, handleBack, handleReset, handleNext, firstStep, lastStep,
}) {
  CustomFormWizardStep.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    formStep: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleReset: PropTypes.bool.isRequired,
    handleNext: PropTypes.bool.isRequired,
    firstStep: PropTypes.bool.isRequired,
    lastStep: PropTypes.bool.isRequired,
  };
  const {
    plaintext,
    numeric,
    numericLabel,
    low,
    high,
    text,
    textLabel,
  } = formStep;
  const forceReset = false; // TODO: implement this

  const getNumberLabel = () => {
    if (!low && !high) {
      return '';
    } if (!low) {
      return `less than ${high}`;
    } if (!high) {
      return `greater than ${low}`;
    }
    return `between ${low} and ${high}`;
  };

  const nextOrResetBtn = (disabled) => (forceReset ? (
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
      disabled={disabled}
    >
      {lastStep ? 'Finish' : 'Next'}
    </Button>
  ));

  const [state, setState] = React.useState({
    numberInput: 0,
    textInput: '',
  });

  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if ((numeric && state.numberInput === 0) || (text && state.textInput === '')) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [state]);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <p>{plaintext}</p>
      {numeric
        && (
        <>
          <p className="customFormWizardLabel">{`${numericLabel} ${getNumberLabel()}`}</p>
          <TextField
            label="Measurement"
            id="margin-normal"
            margin="normal"
            name="numberInput"
            type="number"
            value={state.numberInput}
            className="customFormWizardInput"
            onChange={handleChange}
            // className={classes.textFieldSmall}
            // onChange={(e) => handleChange(e.target.name, e.target.value)}
            // value={state.low}
          />
        </>
        )}
      {text && (
      <>
        <p className="customFormWizardLabel">{textLabel}</p>
        <TextField
          label="Observation"
          id="margin-normal"
          margin="normal"
          name="textInput"
          type="text"
          className="customFormWizardInput"
          value={state.textInput}
          onChange={handleChange}
        />
      </>
      )}
      <div className="my-2">
        <Button
          disabled={firstStep}
          onClick={handleBack}
          className="btn"
        >
          Back
        </Button>
        <span className="mx-2" />
        {nextOrResetBtn(disabled)}
      </div>

    </>
  );
}
