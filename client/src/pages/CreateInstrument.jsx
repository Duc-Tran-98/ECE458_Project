import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import CreateInstrument from '../queries/CreateInstrument';
import UserContext from '../components/UserContext';
import InstrumentForm from '../components/InstrumentForm';
import CalibrationTable from '../components/CalibrationTable';
import AddCalibEvent from '../queries/AddCalibEvent';

function CreateInstrumentPage({ onCreation }) {
  CreateInstrumentPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);
  const [calibHistory, setCalibHistory] = useState([
    {
      user: user.userName,
      date: new Date().toISOString().split('T')[0],
      comment: '',
      id: 0,
      viewOnly: false,
    },
  ]); // calibhistory is the array of calibration events.
  const onChangeCalibRow = (e, entry) => {
    // This method deals with updating a particular calibration event
    const newHistory = [...calibHistory];
    const index = newHistory.indexOf(entry);
    newHistory[index] = { ...entry };
    if (e.target.name === 'user') {
      newHistory[index].user = e.target.value;
    } else if (e.target.name === 'date') {
      newHistory[index].date = e.target.value;
    } else {
      newHistory[index].comment = e.target.value;
    }
    setCalibHistory(newHistory);
  };
  const formState = {
    // This state is for an instrument
    modelNumber: '',
    vendor: '',
    comment: '',
    serialNumber: '',
    calibrationFrequency: 0,
    description: '',
    categories: [],
    assetTag: '', // TODO: use api to get last id of instrument, then add 100001 to it;
  };
  // const [formState, setFormState] = useState({
  //   // This state is for an instrument
  //   modelNumber: '',
  //   vendor: '',
  //   comment: '',
  //   serialNumber: '',
  //   calibrationFrequency: 0,
  //   description: '',
  //   categories: [],
  //   assetTag: '', // TODO: use api to get last id of instrument, then add 100001 to it;
  // });
  const [nextId, setNextId] = useState(1); // This is for assining unique ids to our array
  const addRow = () => {
    // This adds an entry to the array(array = calibration history)
    if (formState.calibrationFrequency > 0) {
      const newHistory = calibHistory;
      newHistory.push({
        user: user.userName,
        date: new Date().toISOString().split('T')[0], // The new Date() thing defaults date to today
        comment: '',
        id: nextId,
        viewOnly: false,
      });
      setNextId(nextId + 1);
      setCalibHistory(newHistory);
    }
  };
  const deleteRow = (rowId) => {
    // This is for deleting an entry from array
    const newHistory = calibHistory.filter((item) => item.id !== rowId);
    setCalibHistory(newHistory);
  };

  const handleSubmit = (values, resetForm) => {
    // This is to submit all the data
    const {
      modelNumber, vendor, comment, serialNumber, categories,
    } = values;
    // check validation here in backend?
    CreateInstrument({
      modelNumber,
      vendor,
      serialNumber,
      categories,
      comment,
    }).then((response) => {
      if (response.success) {
        toast.success(response.message);
        // If we successfully added new instrument
        const validEvents = calibHistory.filter(
          (entry) => entry.user.length > 0,
        ); // Collect valid entries
        if (validEvents.length > 0 && formState.calibrationFrequency > 0) {
          // If there are valid entries, add them to DB
          AddCalibEvent({
            events: validEvents,
            modelNumber,
            vendor,
            serialNumber,
            categories,
            handleResponse: () => undefined,
          });
          resetForm();
        }
        onCreation();
      } else {
        toast.error(response.message);
      }
    });
  };

  const {
    modelNumber,
    vendor,
    serialNumber,
    comment,
    calibrationFrequency,
    categories,
    description,
    assetTag,
  } = formState;
  const footer = calibrationFrequency !== 0 ? (
    <CalibrationTable
      rows={calibHistory}
      deleteRow={deleteRow}
      onChangeCalibRow={onChangeCalibRow}
    />
  ) : (
    <div className="d-flex justify-content-center my-3">
      <h4>Item Not calibratable</h4>
    </div>
  );
  return (
    <>
      <ToastContainer />
      <InstrumentForm
        modelNumber={modelNumber}
        vendor={vendor}
        comment={comment}
        serialNumber={serialNumber}
        categories={categories}
        description={description}
        calibrationFrequency={calibrationFrequency}
        assetTag={assetTag}
        handleFormSubmit={handleSubmit}
      />
      <div className="d-flex justify-content-center my-3">
        <button type="button" className="btn  mx-3" onClick={addRow}>
          Add Calibration Event
        </button>
      </div>
      {footer}
    </>
  );
}

export default CreateInstrumentPage;
