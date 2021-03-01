/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import DeleteInstrument from '../queries/DeleteInstrument';
import GetCalibHistory from '../queries/GetCalibHistory';
import MouseOverPopover from '../components/PopOver';
import CalibrationTable from '../components/CalibrationTable';
import UserContext from '../components/UserContext';
import AddCalibEvent from '../queries/AddCalibEvent';
import ModalAlert from '../components/ModalAlert';
import GetUser from '../queries/GetUser';
import EditInstrument from '../components/EditInstrument';

export default function DetailedInstrumentView({ onDelete }) {
  DetailedInstrumentView.propTypes = {
    onDelete: PropTypes.func.isRequired,
  };
  const user = React.useContext(UserContext);
  const history = useHistory();
  // TODO: put asset tag in url or make api call to get it
  // This code is getting params from url
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const modelNumber = urlParams.get('modelNumber');
  const vendor = urlParams.get('vendor');
  const serialNumber = urlParams.get('serialNumber');
  const description = urlParams.get('description');
  const calibFrequency = urlParams.get('calibrationFrequency');
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
      onDelete();
      setTimeout(() => {
        setResponseMsg('');
        if (show) {
          setShow(false);
        }
        if (history.location.state?.previousUrl) {
          let path = history.location.state.previousUrl.split(window.location.host)[1];
          if (path.includes('count')) {
            const count = parseInt(path.substring(path.indexOf('count')).split('count=')[1], 10) - 1;
            path = path.replace(path.substring(path.indexOf('count')), `count=${count}`);
          }
          history.replace( // This code updates the url to have the correct count
            path,
            null,
          );
        } else {
          history.replace('/', null);
        }
      }, 1000);
    }
  };
  const handleDelete = () => {
    setLoading(true);
    DeleteInstrument({ id, handleResponse });
  };
  // This code  is getting calibration frequency, calibration history and comment of instrument
  const [calibHist, setCalibHist] = useState([]);
  const [nextId, setNextId] = useState(0);
  const fetchData = () => {
    // This will refetch calib history and set it as our state
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
    window.sessionStorage.setItem(
      'expirationDate',
      new Date(calibHist[0].date).addDays(calibFrequency),
    );
    window.sessionStorage.setItem('calibComment', calibHist[0].comment);
    GetUser({ userName: calibHist[0].user }).then((value) => {
      if (value) {
        const calibUser = `Username: ${calibHist[0].user}, First name: ${value.firstName}, Last name: ${value.lastName}`;
        window.sessionStorage.setItem('calibUser', calibUser);
      }
    });
  }

  React.useEffect(() => {
    let active = true;
    (() => {
      const hasEdits = calibHist.filter(() => true).length > 0;
      if (!active) {
        return;
      }
      if (!hasEdits) {
        // doesn't look like it should work, but it does
        fetchData();
      }
    })();
    return () => {
      active = false;
    };
  }, [calibHist]);

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
                <div className="mt-3">
                  <button className="btn " type="button" onClick={handleDelete}>
                    Yes
                  </button>
                </div>
                <span className="mx-3" />
                <div className="mt-3">
                  <button className="btn " type="button" onClick={closeModal}>
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
            initAssetTag="100000"
            footer={(
              <>
                <MouseOverPopover
                  className="col"
                  message="Go to model's detail view"
                >
                  <Link
                    className="btn  text-nowrap"
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
                    <Link className="btn  text-nowrap" to="/viewCertificate">
                      View Certificate
                    </Link>
                  </MouseOverPopover>
                )}
              </>
            )}
          />
        </div>
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
                        <button type="button" className="btn " onClick={addRow}>
                          Add Calibration Event
                        </button>
                      </MouseOverPopover>
                    </div>
                    <div className="col mt-1">
                      <MouseOverPopover message="Save added calibration events">
                        <button
                          type="button"
                          className="btn "
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
