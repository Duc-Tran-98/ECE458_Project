import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import CreateModel from '../queries/CreateModel';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import ModelForm from '../components/ModelForm';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

function CreateModelPage({ onCreation }) {
  CreateModelPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);
  // const [shouldResetForm, setResetForm] = useState(false);
  const [resetForm, setResetForm] = useState(() => {});

  const handleResponse = (response) => {
    console.log(response);
    if (response.success) {
      toast.success(response.message);
      onCreation();
      resetForm();
    } else {
      toast.error(response.message);
    }
  };

  const handleSubmit = (values, formReset) => {
    setResetForm(formReset);
    console.log('Inside CreateModel with values: ');
    console.log(JSON.stringify(values));
    let { calibrationFrequency } = values;
    if (typeof calibrationFrequency === 'string') {
      // If user increments input, it becomes string so change it back to number
      calibrationFrequency = parseInt(calibrationFrequency, 10);
    }
    const {
      modelNumber, vendor, description, comment, categories,
    } = values;
    CreateModel({
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
      categories,
      handleResponse,
    });
  };
  return (

    <>
      {user.isAdmin ? (
        <>
          <ToastContainer />
          <ModelForm
            handleFormSubmit={handleSubmit}
            // shouldResetForm={shouldResetForm}
            // setResetForm={setResetForm}
          />
        </>
      ) : <ErrorPage message="You don't have the right permissions!" />}
    </>
  );
}

export default CreateModelPage;
