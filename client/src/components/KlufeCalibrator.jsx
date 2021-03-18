import React from 'react';

import {
  KlufeOn, KlufeOff, KlufeStep, KlufeStatus,
} from '../queries/KlufeQueries';

export default function KlufeCalibrator() {
  const handleResponse = (response) => {
    console.log(response);
  };

  return (
    <>
      <h2>Testing Klufe Calibrator</h2>
      <button type="button" onClick={() => KlufeOn({ handleResponse })}>Klufe On</button>
      <button type="button" onClick={() => KlufeOff({ handleResponse })}>Klufe Off</button>
      <button type="button" onClick={() => KlufeStep({ handleResponse, stepNum: 13, stepStart: 'hello' })}>Klufe Step</button>
      <button type="button" onClick={() => KlufeStatus({ handleResponse })}>Klufe Status</button>
    </>
  );
}
