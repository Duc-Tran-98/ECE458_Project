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

  return (
    <div>
      <h4>Custom Form Entry Coming Soon</h4>
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
