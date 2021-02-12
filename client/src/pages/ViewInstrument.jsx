import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import InstrumentForm from '../components/InstrumentForm';
import { QueryAndThen } from '../components/UseQuery';
import GetCalibHistory from '../queries/GetCalibHistory';
import CalibrationRow from '../components/CalibrationRow';

export default function DetailedInstrumentView() {
  const query = print(gql`
    query GetInstrument(
      $modelNumber: String!
      $vendor: String!
      $serialNumber: String!
    ) {
      getInstrument(
        modelNumber: $modelNumber
        vendor: $vendor
        serialNumber: $serialNumber
      ) {
        comment
        calibrationFrequency
      }
    }
  `);
  // This code is getting params from url
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const modelNumber = urlParams.get('modelNumber');
  const vendor = urlParams.get('vendor');
  const serialNumber = urlParams.get('serialNumber');
  const description = urlParams.get('description');
  let id = urlParams.get('id');
  id = parseInt(id, 10);
  // This code  is getting calibration frequency and comment of instrument
  const [comment, setComment] = useState('');
  const [calibFrequency, setCalibFrequency] = useState(0);
  const [queried, setQueried] = useState(false);
  const [calibHist, setCalibHist] = useState([]);
  const [nextId, setNextId] = useState(0);
  const getVariables = () => ({ modelNumber, serialNumber, vendor });
  const queryName = 'getInstrument';
  React.useEffect(() => {
    if (!queried) {
      QueryAndThen({ query, queryName, getVariables }).then((data) => {
        setComment(data.comment);
        setCalibFrequency(data.calibrationFrequency);
      });
      GetCalibHistory({ id }).then((data) => {
        data.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.id = nextId;
          setNextId(nextId + 1);
        });
        setCalibHist(data);
      });
      setQueried(true);
    }
  });
  const list = calibHist.map((entry) => (
    <li className="list-group-item" key={entry.id}>
      <CalibrationRow
        id={entry.id}
        onChangeCalibRow={() => undefined}
        comment={entry.comment}
        date={entry.date}
        entry={entry}
        onInputChange={() => undefined}
        viewOnly
      />
    </li>
  ));
  return (
    <div className="d-flex justify-content-center bg-light">
      <div className="col">
        <div className="row">
          <InstrumentForm
            modelNumber={modelNumber}
            vendor={vendor}
            comment={comment}
            serialNumber={serialNumber}
            changeHandler={() => undefined}
            validated
            onInputChange={() => undefined}
            viewOnly
            description={description}
            calibrationFrequency={calibFrequency}
          />
        </div>
        {calibFrequency > 0 ? (
          <div className="row">
            <div
              style={{
                maxHeight: '45vh',
                overflowY: 'auto',
              }}
            >
              <h4>Calibration History:</h4>
              <ul className="list-group">
                {calibHist.length > 0 ? (
                  list
                ) : (
                  <div className="row mt-3">
                    <p className="text-center h4">
                      Instrument not calibrated!
                    </p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="row mt-3">
            <p className="text-center h4">Instrument not calibratable</p>
          </div>
        )}
      </div>
    </div>
  );
}
