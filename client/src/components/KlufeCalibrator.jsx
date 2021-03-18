import React from 'react';

import { KlufeOn, KlufeOff, KlufeStep } from '../queries/KlufeQueries';

export default function KlufeCalibrator() {
  const handleResponse = (response) => {
    console.log(response);
  };

  return (
    <>
      <h2>Testing Klufe Calibrator</h2>
      <button type="button" onClick={() => KlufeOn({ handleResponse })}>Klufe On</button>
      <button type="button" onClick={() => KlufeOff({ handleResponse })}>Klufe Off</button>
      <button type="button" onClick={() => KlufeStep({ handleResponse, stepNum: 4, stepStart: true })}>Klufe Step</button>
    </>
  );
}
