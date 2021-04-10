import React from 'react';
import PropTypes from 'prop-types';

export default function CustomFormEntry({
  getSteps, handleSubmit,
}) {
  CustomFormEntry.propTypes = {
    getSteps: PropTypes.func.isRequired, // return array of steps JSON
    handleSubmit: PropTypes.func.isRequired,
  };

  const steps = getSteps();
  console.log('Creating CustomFormWizard with steps: ');
  console.log(steps);

  const headerStep = (step) => <h1>{step.prompt}</h1>;
  const descriptionStep = (step) => <h4>{step.prompt}</h4>;
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
