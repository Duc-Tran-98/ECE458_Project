import React, { useContext, useState } from 'react';
import CreateInstrument from '../queries/CreateInstrument';
import UserContext from '../components/UserContext';
import InstrumentForm from '../components/InstrumentForm';
import CalibrationTable from '../components/CalibrationTable';
import AddCalibEvent from '../queries/AddCalibEvent';

function CreateInstrumentPage() {
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
  const onChangeCalibRow = (e, entry) => { // This method deals with updating a particular calibration event
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
  const [formState, setFormState] = useState({
    // This state is for an instrument
    modelNumber: '',
    vendor: '',
    comment: '',
    serialNumber: '',
    calibrationFrequency: 0,
    description: '',
  });
  const [nextId, setNextId] = useState(1); // This is for assining unique ids to our array
  const addRow = () => { // This adds an entry to the array(array = calibration history)
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
  };
  const deleteRow = (rowId) => { // This is for deleting an entry from array
    const newHistory = calibHistory.filter((item) => item.id !== rowId);
    setCalibHistory(newHistory);
  };

  const handleSubmit = () => {
    // This is to submit all the data
    const {
      modelNumber, vendor, comment, serialNumber,
    } = formState;

    CreateInstrument({
      modelNumber,
      vendor,
      serialNumber,
      comment,
    }).then((response) => {
      // eslint-disable-next-line no-alert
      alert(response.message);
      if (response.success) {
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
            handleResponse: () => undefined,
          });
        }
        // this section deals with resetting the form
        window.location.reload();
        /*
TODO: clear state instead of reload page
*/
      }
    });
  };

  const changeHandler = (e) => { // This is for updating the instrument's fields from regular inputs
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const onInputChange = (e, v) => { // This if for updating instrument's fields from autocomplete input
    setFormState({
      ...formState, modelNumber: v.modelNumber, vendor: v.vendor, calibrationFrequency: v.calibrationFrequency, description: v.description,
    });
  };
  const {
    modelNumber,
    vendor,
    serialNumber,
    comment,
    calibrationFrequency,
    description,
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
      <InstrumentForm
        modelNumber={modelNumber}
        vendor={vendor}
        comment={comment}
        serialNumber={serialNumber}
        changeHandler={changeHandler}
        validated={false}
        onInputChange={onInputChange}
        description={description}
        calibrationFrequency={calibrationFrequency}
      />
      <div className="d-flex justify-content-center my-3">
        <button type="submit" className="btn  mx-3" onClick={handleSubmit}>
          Create Instrument
        </button>
        <button type="button" className="btn  mx-3" onClick={addRow}>
          Add Calibration Event
        </button>
      </div>
      {footer}
    </>
  );
}

export default CreateInstrumentPage;
/*
TODO: clear state instead of reloading
*/
