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
    // This if for updating instrument's fields from autocomplete input
    // if (typeof v === "string") {
    //   setFormState({
    //     ...formState,
    //     vendor: v,
    //   });
    // } else if (v && v.inputValue) {
    //   // Create a new value from the user input
    //   setFormState({
    //     ...formState,
    //     vendor: v.inputValue,
    //   });
    // } else {
    //   setFormState({
    //     ...formState,
    //     vendor: v.vendor,
    //   });
    // }
    console.log(e);
    console.log(v);
    if (v.inputValue) {
      setFormState({
        ...formState,
        vendor: v.inputValue,
      });
    } else {
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
    <div className="d-flex justify-content-center mt-5">
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
    </div>
  );
}

export default CreateModelPage;

/*
if (typeof v === 'string') {
            setValue({
              title: v,
            });
          } else if (v && v.inputValue) {
            // Create a new value from the user input
            setValue({
              title: v.inputValue,
            });
          } else {
            setValue(v);
          }
*/
