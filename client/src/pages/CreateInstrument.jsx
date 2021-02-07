import React, { useContext, useState } from 'react';
import CreateInstrument from '../queries/CreateInstrument';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import InstrumentForm from '../components/InstrumentForm';
import VerticalLinearStepper from '../components/VerticalStepper';
import CalibrationTable from '../components/CalibrationTable';

function CreateInstrumentPage() {
  const [validated, setValidated] = useState(false);
  const [formState, setFormState] = useState({
    modelNumber: '',
    vendor: '',
    comment: '',
    serialNumber: '0',
  });
  // const [calibHistory, setCalibHistory] = useState([]);

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
          <CalibrationTable />
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
