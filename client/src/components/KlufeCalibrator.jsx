import React from 'react';

import KlufeOn from '../queries/KlufeOn';

export default function KlufeCalibrator() {
  const handleResponse = (response) => {
    console.log(response);
  };

  return (
    <>
      <h2>Testing Klufe Calibrator</h2>
      <button type="submit" onClick={() => KlufeOn({ handleResponse })}>Klufe On</button>
    </>
  );
}
