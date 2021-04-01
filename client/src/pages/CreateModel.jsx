import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import CreateModel from '../queries/CreateModel';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import ModelForm from '../components/ModelForm';

function CreateModelPage({ onCreation }) {
  CreateModelPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);
  // const [shouldResetForm, setResetForm] = useState(false);
  const [resetForm, setResetForm] = useState(() => {});

  const handleResponse = (response) => {
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
    let { calibrationFrequency } = values;
    if (typeof calibrationFrequency === 'string') {
      // If user increments input, it becomes string so change it back to number
      calibrationFrequency = parseInt(calibrationFrequency, 10);
    }
    const {
      modelNumber, vendor, description, comment, categories, supportLoadBankCalibration, supportKlufeCalibration, supportCustomCalibration, requiresCalibrationApproval,
    } = values;
    CreateModel({
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
      supportLoadBankCalibration,
      supportKlufeCalibration,
      supportCustomCalibration,
      requiresCalibrationApproval,
      customForm: '',
      categories,
      handleResponse,
    });
  };
  return (

    <>
      {(user.isAdmin || user.modelPermission) ? (
        <>
          <ModelForm
            handleFormSubmit={handleSubmit}
            type="create"
          />
        </>
      ) : <ErrorPage message="You don't have the right permissions!" />}
    </>
  );
}

export default CreateModelPage;
