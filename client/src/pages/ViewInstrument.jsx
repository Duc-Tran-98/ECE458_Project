/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteInstrument from '../queries/DeleteInstrument';
import { QueryAndThen } from '../components/UseQuery';
import GetCalibHistory from '../queries/GetCalibHistory';
import MouseOverPopover from '../components/PopOver';
import CalibrationTable from '../components/CalibrationTable';
import UserContext from '../components/UserContext';
import AddCalibEvent from '../queries/AddCalibEvent';
import ModalAlert from '../components/ModalAlert';
import GetUser from '../queries/GetUser';
import EditInstrument from '../components/EditInstrument';

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
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [responseMsg, setResponseMsg] = React.useState('');
  const closeModal = () => {
    setShow(false);
  };
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      setTimeout(() => {
        setResponseMsg('');
        if (show) {
          setShow(false);
        }
        window.location.replace('/'); // This makes it so the user can't navigate back
        // to this page (they just deleted it) and redirects them to homepage after deletion
      }, 1000);
    }
  };
  const handleDelete = () => {
    setLoading(true);
    DeleteInstrument({ id, handleResponse });
  };
  // This code  is getting calibration frequency, calibration history and comment of instrument
  // const [comment, setComment] = useState('');
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
        // setComment(data.comment);
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
    if (validEvents.length > 0) {
      // If there are valid entries, add them to DB
      console.log('added new event(s)');
      AddCalibEvent({
        events: validEvents,
        modelNumber,
        vendor,
        serialNumber,
        handleResponse: () => fetchData(),
      });
    }
  };
  // This code is for setting window variables for certificate
  if (calibFrequency > 0 && calibHist.length > 0) {
    window.sessionStorage.setItem('serialNumber', serialNumber);
    window.sessionStorage.setItem('modelNumber', modelNumber);
    window.sessionStorage.setItem('modelDescription', description);
    window.sessionStorage.setItem('vendor', vendor);
    window.sessionStorage.setItem('calibrationDate', calibHist[0].date);
    window.sessionStorage.setItem('expirationDate', new Date(calibHist[0].date).addDays(calibFrequency));
    window.sessionStorage.setItem('calibComment', calibHist[0].comment);
    GetUser({ userName: calibHist[0].user }).then((value) => {
      if (value) {
        const calibUser = `Username: ${calibHist[0].user}, First name: ${value.firstName}, Last name: ${value.lastName}`;
        window.sessionStorage.setItem('calibUser', calibUser);
      }
    });
  }

  return (
    <>
      <ModalAlert
        show={show}
        handleClose={closeModal}
        title="DELETE INSTRUMENT"
      >
        <>
          {responseMsg.length === 0 && (
            <div className="h4 text-center my-3">{`You are about to delete ${vendor}:${modelNumber}:${serialNumber}. Are you sure?`}</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h4">{responseMsg}</div>
            ) : (
              <>
                <div className="mx-5 mt-3">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={handleDelete}
                  >
                    Yes
                  </button>
                </div>
                <div className="mx-5 mt-3">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={closeModal}
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      </ModalAlert>
      <div className="col">
        <div className="row">
          <EditInstrument
            handleDelete={() => setShow(true)}
            initModelNumber={modelNumber}
            initVendor={vendor}
            initSerialNumber={serialNumber}
            id={id}
            description={description}
            footer={(
              <>
                <MouseOverPopover
                  className="col"
                  message="Go to model's detail view"
                >
                  <Link
                    className="btn btn-dark text-nowrap"
                    to={`/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}&description=${description}`}
                  >
                    View Model
                  </Link>
                </MouseOverPopover>
                {calibHist.filter((entry) => entry.viewOnly).length > 0 && (
                  <MouseOverPopover
                    className="col"
                    message="View instrument's calibration certificate"
                  >
                    <Link
                      className="btn btn-dark text-nowrap"
                      to="/viewCertificate"
                    >
                      View Certificate
                    </Link>
                  </MouseOverPopover>
                )}
              </>
            )}
          />
        </div>
        {/* <div className="d-flex justify-content-center mx-3 mt-3">
          <MouseOverPopover className="" message="Go to model's detail view">
            <Link
              className="btn btn-dark mx-3"
              to={`/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}&description=${description}`}
            >
              View Model
            </Link>
          </MouseOverPopover>
          {calibHist.filter((entry) => entry.viewOnly).length > 0 && (
            <MouseOverPopover
              className=""
              message="View instrument's calibration certificate"
            >
              <Link className="btn btn-dark mx-3" to="/viewCertificate">
                View Certificate
              </Link>
            </MouseOverPopover>
          )}
        </div> */}
        <div className="row px-3 mt-3">
          <div
            style={{
              maxHeight: '45vh',
              overflowY: 'auto',
            }}
          >
            <div className="sticky-top bg-secondary text-light">
              <div className="row px-3">
                <h2 className="col">Calibration History:</h2>
                {calibFrequency > 0 && (
                  <>
                    <div className="col mt-1">
                      <MouseOverPopover message="Add new calibration event">
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={addRow}
                        >
                          Add Calibration Event
                        </button>
                      </MouseOverPopover>
                    </div>
                    <div className="col mt-1">
                      <MouseOverPopover message="Save added calibration events">
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                      </MouseOverPopover>
                    </div>
                  </>
                )}
              </div>
            </div>
            {calibFrequency > 0 ? (
              <CalibrationTable
                rows={calibHist}
                deleteRow={deleteRow}
                onChangeCalibRow={onChangeCalibRow}
              />
            ) : (
              <div className="row mt-3">
                <p className="text-center h4">Instrument not calibratable</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
