import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import InstrumentForm from '../components/InstrumentForm';
import { QueryAndThen } from '../components/UseQuery';
import GetCalibHistory from '../queries/GetCalibHistory';
// import CalibrationRow from '../components/CalibrationRow';
import CalibrationTable from '../components/CalibrationTable';
import UserContext from '../components/UserContext';
import AddCalibEvent from '../queries/AddCalibEvent';

export default function DetailedInstrumentView() {
  const user = React.useContext(UserContext);
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
  // This code  is getting calibration frequency, calibration history and comment of instrument
  const [comment, setComment] = useState('');
  const [calibFrequency, setCalibFrequency] = useState(0);
  const [queried, setQueried] = useState(false);
  const [calibHist, setCalibHist] = useState([]);
  const [nextId, setNextId] = useState(0);
  const getVariables = () => ({ modelNumber, serialNumber, vendor });
  const queryName = 'getInstrument';
  const fetchData = () => { // This will refetch calib history and set it as our state
    GetCalibHistory({ id }).then((data) => {
      let counter = 0;
      data.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.id = counter;
        // eslint-disable-next-line no-param-reassign
        item.viewOnly = true;
        counter += 1;
      });
      setCalibHist(data);
      setNextId(counter);
    });
  };
  React.useEffect(() => {
    if (!queried) {
      QueryAndThen({ query, queryName, getVariables }).then((data) => {
        setComment(data.comment);
        setCalibFrequency(data.calibrationFrequency);
      });
      fetchData();
      setQueried(true);
    }
  });
  const addRow = () => {
    // This adds an entry to the array(array = calibration history)
    const newHistory = calibHist;
    newHistory.push({
      user: user.userName,
      date: new Date().toISOString().split('T')[0], // The new Date() thing defaults date to today
      comment: '',
      id: nextId,
      viewOnly: false,
    });
    setNextId(nextId + 1);
    setCalibHist(newHistory);
  };
  const deleteRow = (rowId) => {
    const newHistory = calibHist.filter((item) => item.id !== rowId);
    setCalibHist(newHistory);
  };
  const onChangeCalibRow = (e, entry) => {
    // This method deals with updating a particular calibration event
    const newHistory = [...calibHist];
    const index = newHistory.indexOf(entry);
    newHistory[index] = { ...entry };
    if (e.target.name === 'user') {
      newHistory[index].user = e.target.value;
    } else if (e.target.name === 'date') {
      newHistory[index].date = e.target.value;
    } else {
      newHistory[index].comment = e.target.value;
    }
    setCalibHist(newHistory);
  };
  const handleSubmit = () => {
    const validEvents = calibHist.filter((entry) => !entry.viewOnly); // Collect valid entries
    console.log(validEvents);
    if (validEvents.length > 0) {
      // If there are valid entries, add them to DB
      const handleRes = (res) => {
        console.log(res);
        fetchData();
      };
      AddCalibEvent({
        events: validEvents,
        modelNumber,
        vendor,
        serialNumber,
        handleResponse: handleRes,
      });
    }
  };
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
          <div className="row border-top border-dark">
            <div
              style={{
                maxHeight: '45vh',
                overflowY: 'auto',
              }}
            >
              <div className="sticky-top bg-secondary text-light">
                <h4>Calibration History:</h4>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
              </div>
              <CalibrationTable
                rows={calibHist}
                addRow={addRow}
                deleteRow={deleteRow}
                onChangeCalibRow={onChangeCalibRow}
              />
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
