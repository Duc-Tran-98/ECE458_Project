import React, { useContext, useState } from 'react';
import CreateModel from '../queries/CreateModel';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import ModelForm from '../components/ModelForm';

function CreateModelPage() {
  const [validated, setValidated] = useState(false);
  const [formState, setFormState] = useState({
    modelNumber: '', vendor: '', description: '', comment: '', calibrationFrequency: '0',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      let { calibrationFrequency } = formState;
      if (typeof calibrationFrequency === 'string') { // If user increments input, it becomes string so change it back to number
        calibrationFrequency = parseInt(calibrationFrequency, 10);
      }
      const {
        modelNumber, vendor, description, comment,
      } = formState;
      const handleResponse = (response) => {
        // eslint-disable-next-line no-alert
        alert(response.message);
      };
      CreateModel({
        modelNumber,
        vendor,
        description,
        comment,
        calibrationFrequency,
        handleResponse,
      });
    }

    setValidated(true);
  };

  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const onInputChange = (e, v) => {
    // This if for model's instrument's fields from autocomplete input
    if (v.inputValue) { // If use inputs a new value
      setFormState({
        ...formState,
        vendor: v.inputValue,
      });
    } else { // Else they picked an existing option
      setFormState({
        ...formState,
        vendor: v.vendor,
      });
    }
  };
  const user = useContext(UserContext);
  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }
  const {
    modelNumber, vendor, description, comment, calibrationFrequency,
  } = formState;
  return (
    <>
      <ModelForm
        modelNumber={modelNumber}
        vendor={vendor}
        description={description}
        comment={comment}
        calibrationFrequency={calibrationFrequency}
        handleSubmit={handleSubmit}
        changeHandler={changeHandler}
        validated={validated}
        onInputChange={onInputChange}
      />
    </>
  );
}

export default CreateModelPage;
