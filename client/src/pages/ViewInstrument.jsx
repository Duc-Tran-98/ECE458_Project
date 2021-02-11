import React from 'react';

export default function ViewInstrument() {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const modelNumber = urlParams.get('modelNumber');
  const vendor = urlParams.get('vendor');
  const serialNumber = urlParams.get('serialNumber');
  console.log(modelNumber, vendor, serialNumber);
  return (
    <div className="d-flex justify-content-center bg-light">
      <span>Cool</span>
    </div>
  );
}
