import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import AsyncSuggest from './AsyncSuggest';

const GET_MODELS_QUERY = gql`
  query Models {
    getAllModels {
      modelNumber
      vendor
    }
  }
`;
const query = print(GET_MODELS_QUERY);
const queryName = 'getAllModels';

export default function InstrumentForm({
  // modelNumber,
  // vendor,
  // calibrationFrequency,
  comment,
  handleSubmit,
  changeHandler,
  onInputChange,
  serialNumber,
  validated,
  viewOnly,
}) {
  InstrumentForm.propTypes = {
    // modelNumber: PropTypes.string.isRequired,
    // vendor: PropTypes.string.isRequired,
    // calibrationFrequency: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    validated: PropTypes.bool.isRequired,
    serialNumber: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    // eslint-disable-next-line react/require-default-props
    viewOnly: PropTypes.bool,
  };
  const disabled = !(typeof viewOnly === 'undefined' || !viewOnly);
  const formatOption = (option) => `${option.vendor} ${option.modelNumber}`;
  const formatSelected = (option, value) => option.modelNumber === value.modelNumber && option.vendor === value.vendor;
  return (
    <Form
      className="needs-validation bg-light rounded"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <div className="mt-4 d-flex justify-content-center">
        <Form.Group>
          <Form.Label className="h4 text-center">Model Selection</Form.Label>
          <AsyncSuggest
            query={query}
            queryName={queryName}
            onInputChange={onInputChange}
            label="Choose a model"
            getOptionSelected={formatSelected}
            getOptionLabel={formatOption}
          />
          <Form.Control.Feedback type="invalid">
            Please select a model.
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            Looks good!
          </Form.Control.Feedback>
        </Form.Group>
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <Form.Group controlId="formDescription">
            <Form.Label className="h4">Serial Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="serialNumber"
              required
              name="serialNumber"
              value={serialNumber}
              onChange={changeHandler}
              disabled={disabled}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid serial number.
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
              value={comment}
              onChange={changeHandler}
              disabled={disabled}
            />
          </Form.Group>
        </div>
      </div>
      {(typeof viewOnly === 'undefined' || !viewOnly) && (
        <div className="d-flex justify-content-center mt-3 mb-3">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      )}
    </Form>
  );
}

/*
<div className="col mt-2">
          <Form.Group controlId="formModelNumber">
            <Form.Label className="h4">Model Number</Form.Label>
            <AsyncSuggest
              query={query}
              label="Model Number"
              queryName={queryName}
              id="modelNumber"
              suggestHandler={suggestHandler}
            />
          </Form.Group>
        </div>
        <div className="col mt-2">
          <Form.Group controlId="formVendor">
            <Form.Label className="h4">Vendor</Form.Label>
            {viewOnly ? (
              <Form.Control
                name="vendor"
                type="text"
                placeholder="Vendor"
                required
                value={vendor}
                onChange={changeHandler}
              />
            ) : (
              <AsyncSuggest
                query={query}
                label="Vendor"
                queryName={queryName}
                id="vendor"
                suggestHandler={suggestHandler}
              />
            )}
            <Form.Control.Feedback type="invalid">
              Please enter a valid vendor.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
*/
