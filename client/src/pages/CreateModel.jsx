import React, { useContext, useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import Query from '../components/UseQuery';
import ModelForm from '../components/ModelForm';

function CreateModel() {
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
      const ADD_MODEL = gql`
        mutation AddModel($modelNumber: String!, $vendor: String!, $description: String!, $comment: String, $calibrationFrequency: Int) {
          addModel(modelNumber: $modelNumber, vendor: $vendor, comment: $comment, description: $description, calibrationFrequency: $calibrationFrequency)
        }
      `;
      const query = print(ADD_MODEL);
      const queryName = 'addModel';
      const getVariables = () => ({
        modelNumber, vendor, description, comment, calibrationFrequency,
      });
      const handleResponse = (response) => {
        // eslint-disable-next-line no-alert
        alert(response.message);
      };
      Query({
        query, queryName, getVariables, handleResponse,
      });
    }

    setValidated(true);
  };

  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
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
      />
    </div>
  );
}

export default CreateModel;
