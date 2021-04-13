import React from 'react';
import PropTypes from 'prop-types';
import { stepInfo } from '../utils/Klufe';

const klufeRow = (step, klufeJSON) => (
  <div className="row">
    <div className="col">{stepInfo[step].source}</div>
    <div className="col">{stepInfo[step].range}</div>
    <div className="col">
      <input
        type="number"
        value={klufeJSON.readings[step]}
        disabled
        className="w-50"
      />
    </div>
    <div className="col">
      <input
        type="text"
        value="OK"
        disabled
        className="w-50"
      />
    </div>
  </div>
);
export default function KlufeDetailedView({ klufeData }) {
  KlufeDetailedView.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    klufeData: PropTypes.object.isRequired,
  };
  return (
    <>
      <div className="container mx-3 my-2">
        <div className="row">
          <div className="col h6">
            Source
          </div>
          <div className="col h6">
            Acceptable Range [V]
          </div>
          <div className="col h6">
            Actual Value [V]
          </div>
          <div className="col h6">
            OK?
          </div>
        </div>
        {klufeRow(4, klufeData)}
        {klufeRow(7, klufeData)}
        {klufeRow(9, klufeData)}
        {klufeRow(11, klufeData)}
        {klufeRow(13, klufeData)}
      </div>
    </>
  );
}

/*
const klufeData = JSON.stringify({
      readings,
      step4ok,
      step7ok,
      step9ok,
      step11ok,
      step13ok,
    });
*/
