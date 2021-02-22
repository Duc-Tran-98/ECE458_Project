import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import AsyncSuggest from './AsyncSuggest';

const GET_MODELS_QUERY = gql`
  query Models {
    getUniqueVendors {
      vendor
    }
  }
`;
const query = print(GET_MODELS_QUERY);
const queryName = 'getUniqueVendors';

export default function ModelForm({
  modelNumber, vendor, calibrationFrequency, comment, description, handleSubmit, changeHandler, validated, viewOnly, onInputChange, diffSubmit,
}) {
  ModelForm.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    calibrationFrequency: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    validated: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/require-default-props
    viewOnly: PropTypes.bool,
    onInputChange: PropTypes.func.isRequired, // This what to do when autocomplete value changes
    diffSubmit: PropTypes.bool, // whether or not to display own submit button
  };
  ModelForm.defaultProps = {
    diffSubmit: false,
  };
  const disabled = !((typeof viewOnly === 'undefined' || !viewOnly));
  const formatOption = (option) => `${option.vendor}`;
  const formatSelected = (option, value) => option.vendor === value.vendor;
  const val = { vendor };
  return (
    <Form
      className="needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <div className="row mx-3">
        <div className="col mt-3">
          <Form.Group controlId="formModelNumber">
            <Form.Label className="h4">Model Number</Form.Label>
            <Form.Control
              name="modelNumber"
              type="text"
              placeholder="####"
              required
              value={modelNumber}
              onChange={changeHandler}
              disabled={disabled}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid model number.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col mt-3">
          <Form.Group>
            <Form.Label className="h4">Vendor</Form.Label>
            {viewOnly ? (
              <Form.Control
                type="text"
                name="modelSelection"
                value={`${vendor}`}
                onChange={changeHandler}
                disabled={disabled}
              />
            ) : (
              <AsyncSuggest
                query={query}
                queryName={queryName}
                onInputChange={onInputChange}
                label="Choose a vendor"
                getOptionSelected={formatSelected}
                getOptionLabel={formatOption}
                value={val}
                allowAdditions
              />
            )}
          </Form.Group>
        </div>
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <Form.Group controlId="formCalibrationFrequency">
            <Form.Label className="h4 text-nowrap ">
              Calibration Frequency
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="# Days"
              min={0}
              name="calibrationFrequency"
              value={calibrationFrequency}
              onChange={changeHandler}
              disabled={disabled}
            />
          </Form.Group>
        </div>
        <div className="col mt-3">
          <Form.Group controlId="formDescription">
            <Form.Label className="h4">Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              required
              name="description"
              value={description}
              onChange={changeHandler}
              disabled={disabled}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid description.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <Form.Group controlId="formComment">
            <Form.Label className="h4">Comment</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Sample comment"
              rows={3}
              name="comment"
              value={comment}
              onChange={changeHandler}
              disabled={disabled}
            />
          </Form.Group>
        </div>
      </div>
      {((typeof viewOnly === 'undefined' || !viewOnly) && !diffSubmit) && (
        <div className="d-flex justify-content-center mt-3 mb-3">
          <button type="submit" className="btn btn-dark">
            Add Model
          </button>
        </div>
      )}
    </Form>
  );
}
