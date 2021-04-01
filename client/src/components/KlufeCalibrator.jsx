import React from 'react';

import {
  KlufeOn, KlufeOff, KlufeStep, KlufeStatus,
} from '../queries/KlufeQueries';

export default function KlufeCalibrator() {
  // eslint-disable-next-line no-unused-vars
  const handleResponse = (response) => {
    // console.log(response);
  };

  return (
    <>
      <h2>Testing Klufe Calibrator</h2>
      <button type="button" onClick={() => KlufeOn({ handleResponse })}>Klufe On</button>
      <button type="button" onClick={() => KlufeOff({ handleResponse })}>Klufe Off</button>
      <button type="button" onClick={() => KlufeStep({ handleResponse, stepNum: 11, stepStart: true })}>Klufe Step</button>
      <button type="button" onClick={() => KlufeStatus({ handleResponse })}>Klufe Status</button>
    </>
  );
}
