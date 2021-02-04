import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import Query from '../components/UseQuery';

function CreateModel() {
  const [validated, setValidated] = useState(false);
  const [formState, setFormState] = useState({
    modelNumber: '', vendor: '', description: '', comment: '', calibrationFrequency: 0,
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
  return (
    <div className="d-flex justify-content-center mt-5">
      <Form
        className="needs-validation bg-light rounded"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="row mx-3">
          <div className="col mt-2">
            <Form.Group controlId="formModelNumber">
              <Form.Label className="h4">Model Number</Form.Label>
              <Form.Control
                name="modelNumber"
                type="text"
                placeholder="####"
                required
                value={formState.modelNumber}
                onChange={changeHandler}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid model number.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-2">
            <Form.Group controlId="formVendor">
              <Form.Label className="h4">Vendor</Form.Label>
              <Form.Control
                name="vendor"
                type="text"
                placeholder="Vendor"
                required
                value={formState.vendor}
                onChange={changeHandler}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid vendor.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-2">
            <Form.Group controlId="formCalibrationFrequency">
              <Form.Label className="h4 text-nowrap ">
                Calibration Frequency
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="# Days"
                min={0}
                name="calibrationFrequency"
                value={formState.calibrationFrequency}
                onChange={changeHandler}
              />
            </Form.Group>
          </div>
        </div>
        <div className="row mx-3 border-top border-dark mt-3">
          <div className="col mt-3">
            <Form.Group controlId="formDescription">
              <Form.Label className="h4">Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                required
                name="description"
                value={formState.description}
                onChange={changeHandler}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid description.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-3">
            <Form.Group controlId="formComment">
              <Form.Label className="h4">Comment</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Sample comment"
                rows={3}
                name="comment"
                value={formState.comment}
                onChange={changeHandler}
              />
            </Form.Group>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3 mb-3">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateModel;
