import { gql } from '@apollo/client';
import { print } from 'graphql';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Query from './UseQuery';

export default function EditModel({ modelNumber, vendor }) {
  EditModel.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
  };
  const [formState, setFormState] = useState({
    vendor: '', modelNmber: '', description: '', comment: '', calibrationFrequency: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const FIND_MODEL = gql`
      query FindModel($modelNumber: String!, $vendor: String!) {
        findModel(modelNumber: $modelNumber, vendor: $vendor) {
          vendor
          modelNumber
          description
          comment
          calibrationFrequency
        }
      }
    `;
  const query = print(FIND_MODEL);
  const queryName = 'findModel';
  const getVariables = () => ({ modelNumber, vendor });
  const handleResponse = (response) => {
    console.log(response);
    setFormState(response);
  };
  if (formState.description === '') {
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  }
  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  return (
    <div className="d-flex justify-content-center">
      <Form
        className="bg-light rounded"
        onSubmit={handleSubmit}
      >
        <div className="row mx-3">
          <div className="col mt-1">
            <Form.Group controlId="formModelNumber">
              <Form.Label className="h4">Model Number</Form.Label>
              <Form.Control
                name="modelNumber"
                type="text"
                value={formState.modelNumber}
                onChange={changeHandler}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid model number.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-1">
            <Form.Group controlId="formVendor">
              <Form.Label className="h4">Vendor</Form.Label>
              <Form.Control
                name="vendor"
                type="text"
                value={formState.vendor}
                onChange={changeHandler}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid vendor.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-1">
            <Form.Group controlId="formCalibrationFrequency">
              <Form.Label className="h4 text-nowrap ">
                Calibration Frequency
              </Form.Label>
              <Form.Control
                type="number"
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
