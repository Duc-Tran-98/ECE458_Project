import React, { useContext, useState } from 'react';
import CreateInstrument from '../queries/CreateInstrument';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import InstrumentForm from '../components/InstrumentForm';
import VerticalLinearStepper from '../components/VerticalStepper';
import CalibrationTable from '../components/CalibrationTable';

function CreateInstrumentPage() {
  const [calibHistory, setCalibHistory] = useState([{
    user: '', date: '', comment: '', id: 0,
  }]);
  const onChangeCalibRow = (e, entry) => {
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
    // // console.log(e, id);
    // const entry = calibHistory.filter((item) => item.id === id)[id];// Find entry that changed
    // // entry[id][e.target.name] = e.target.value; // update its values
    // if (e.target.name === 'user') {
    //   entry.user = e.target.value;
    // } else if (e.target.name === 'date') {
    //   entry.date = e.target.value;
    // } else {
    //   entry.comment = e.target.value;
    // }
    // // console.log(entry);
    // const newHistory = calibHistory.filter((item) => item.id !== id);// Get every other entry
    // newHistory.push(entry);// Add updated entry to list
    // setCalibHistory(newHistory);
  };
  const [validated, setValidated] = useState(false);
  const [formState, setFormState] = useState({
    modelNumber: '',
    vendor: '',
    comment: '',
    serialNumber: '',
  });
  const [rows, setRows] = useState([0]);
  const [nextId, setNextId] = useState(1);
  const addRow = () => {
    const newRows = rows;
    const newHistory = calibHistory;
    newHistory.push({
      user: '', date: '', comment: '', id: nextId,
    });
    newRows.push(nextId);
    setNextId(nextId + 1);
    setRows(newRows);
    setCalibHistory(newHistory);
  };
  const deleteRow = (rowId) => {
    if (rows.length > 1) {
      const newRows = rows.filter((id) => id !== rowId);
      const newHistory = calibHistory.filter((item) => item.id !== rowId);
      setRows(newRows);
      setCalibHistory(newHistory);
    } else {
      // eslint-disable-next-line no-alert
      alert('Cannot delete the last row');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const {
        modelNumber, vendor, comment, serialNumber,
      } = formState;
      const handleResponse = (response) => {
        // eslint-disable-next-line no-alert
        alert(response.message);
      };
      CreateInstrument({
        modelNumber,
        vendor,
        serialNumber,
        comment,
        handleResponse,
      });
    }
    setValidated(true);
  };

  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const onInputChange = (e, v) => {
    // console.log(e, v);
    setFormState({ ...formState, modelNumber: v.modelNumber, vendor: v.vendor });
  };
  const user = useContext(UserContext);
  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }
  const {
    modelNumber, vendor, serialNumber, comment,
  } = formState;
  const getSteps = () => ['Select Model', 'Input Calibration History', 'Review'];
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <InstrumentForm
            modelNumber={modelNumber}
            vendor={vendor}
            comment={comment}
            serialNumber={serialNumber}
            handleSubmit={handleSubmit}
            changeHandler={changeHandler}
            validated={validated}
            onInputChange={onInputChange}
          />
        );
      case 1:
        return (
          <CalibrationTable rows={calibHistory} addRow={addRow} deleteRow={deleteRow} onChangeCalibRow={onChangeCalibRow} />
        );
      case 2:
        return 'Review!';
      default:
        return 'Unknown step';
    }
  };
  return (
    <div className="d-flex justify-content-center mt-5">
      <VerticalLinearStepper getSteps={getSteps} getStepContent={getStepContent} />
    </div>
  );
}

export default CreateInstrumentPage;
