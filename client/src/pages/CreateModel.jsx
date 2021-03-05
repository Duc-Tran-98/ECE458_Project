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
  const [formState, setFormState] = useState({
    modelNumber: '',
    vendor: '',
    description: '',
    comment: '',
    calibrationFrequency: '0',
    categories: [],
  });
  const user = useContext(UserContext);

  const handleResponse = (response) => {
    console.log(response);
    toast(response.message);
    if (response.success) {
      onCreation();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { calibrationFrequency } = formState;
    if (typeof calibrationFrequency === 'string') {
      // If user increments input, it becomes string so change it back to number
      calibrationFrequency = parseInt(calibrationFrequency, 10);
    }
    const {
      modelNumber, vendor, description, comment, categories,
    } = formState;
    CreateModel({
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
      categories,
      handleResponse,
    });
  //  }
  };

  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const onInputChange = (e, v) => {
    // This if for model's instrument's fields from autocomplete input
    const vendorValue = v.inputValue ? v.inputValue : v.vendor;
    setFormState({
      ...formState,
      vendor: vendorValue,
    });
  };

  const {
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
    categories,
  } = formState;
  return (

    <>
      {user.isAdmin ? (
        <>
          <ToastContainer />
          <ModelForm
            modelNumber={modelNumber}
            vendor={vendor}
            description={description}
            comment={comment}
            calibrationFrequency={calibrationFrequency}
            categories={categories}
            handleSubmit={handleSubmit}
            changeHandler={changeHandler}
            validated={false}
            onInputChange={onInputChange}
          />
        </>
      ) : <ErrorPage message="You don't have the right permissions!" />}
    </>
  );
}

export default CreateModelPage;
