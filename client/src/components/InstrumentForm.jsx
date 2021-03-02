import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import AsyncSuggest from './AsyncSuggest';
import TagsInput from './TagsInput';

const GET_MODELS_QUERY = gql`
  query Models {
    getAllModels {
      modelNumber
      vendor
      calibrationFrequency
      description
    }
  }
`;
const query = print(GET_MODELS_QUERY);
const queryName = 'getAllModels';

export default function InstrumentForm({
  // calibrationFrequency,
  comment,
  handleSubmit,
  changeHandler,
  onInputChange,
  assetTag,
  serialNumber,
  categories,
  validated,
  viewOnly,
  modelNumber,
  vendor,
  description,
  calibrationFrequency,
}) {
  InstrumentForm.propTypes = {
    // eslint-disable-next-line react/require-default-props
    modelNumber: PropTypes.string,
    // eslint-disable-next-line react/require-default-props
    vendor: PropTypes.string,
    // calibrationFrequency: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    validated: PropTypes.bool.isRequired,
    serialNumber: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array.isRequired,
    onInputChange: PropTypes.func.isRequired,
    assetTag: PropTypes.string.isRequired,
    // eslint-disable-next-line react/require-default-props
    viewOnly: PropTypes.bool, // If true, then the fields are disabled and no input changes can be made
    description: PropTypes.string,
    calibrationFrequency: PropTypes.number,
  };
  InstrumentForm.defaultProps = {
    handleSubmit: null,
    viewOnly: false,
    description: '',
    calibrationFrequency: 0,
  };
  const val = modelNumber.length > 0 ? { modelNumber, vendor } : null;
  const disabled = !(typeof viewOnly === 'undefined' || !viewOnly);
  const formatOption = (option) => `${option.vendor} ${option.modelNumber}`;
  const formatSelected = (option, value) => option.modelNumber === value.modelNumber && option.vendor === value.vendor;
  const selectedTags = (tags) => {
    console.log(tags);
  };
  return (
    <Form
      className="needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <div className="row mx-3">
        <div className="col mt-3">
          <Form.Group>
            <Form.Label className="h4 text-center">Model Selection</Form.Label>
            {viewOnly ? (
              <Form.Control
                type="text"
                name="modelSelection"
                value={`${vendor} ${modelNumber}`}
                onChange={changeHandler}
                disabled={disabled}
              />
            ) : (
              <AsyncSuggest
                query={query}
                queryName={queryName}
                onInputChange={onInputChange}
                label="Choose a model"
                getOptionSelected={formatSelected}
                getOptionLabel={formatOption}
                value={val}
              />
            )}
          </Form.Group>
        </div>
        <div className="col mt-3">
          <Form.Group controlId="formDescription">
            <Form.Label className="h4">Asset Tag</Form.Label>
            <Form.Control
              type="number"
              required
              min={100000}
              name="assetTag"
              value={assetTag}
              onChange={changeHandler}
              disabled={disabled}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid Asset Tag.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <Form.Group>
            <Form.Label className="h4 text-center text-nowrap ">
              Calibration Frequency
            </Form.Label>
            <Form.Control
              type="text"
              name="calibrationFrequency"
              value={calibrationFrequency}
              disabled
            />
          </Form.Group>
        </div>
        <div className="col mt-3">
          <Form.Group>
            <Form.Label className="h4 text-center">
              Model Description
            </Form.Label>
            <Form.Control
              type="text"
              name="modelDescription"
              value={description}
              disabled
            />
          </Form.Group>
        </div>
        <div className="col mt-3">
          <Form.Group controlId="formDescription">
            <Form.Label className="h4">Serial Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Serial Number"
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
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <Form.Group controlId="formComment">
            <Form.Label className="h4">Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comment"
              value={comment}
              onChange={changeHandler}
              disabled={disabled}
            />
          </Form.Group>
        </div>
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <Form.Label className="h4">Categories</Form.Label>
          <TagsInput
            selectedTags={selectedTags}
            tags={categories}
            dis={disabled}
            models={false}
          />
        </div>
      </div>
      {handleSubmit && (
        <div className="d-flex justify-content-center my-3">
          <button type="submit" className="btn ">
            Create Instrument
          </button>
        </div>
      )}
    </Form>
  );
}

/*
{(typeof viewOnly === 'undefined' || !viewOnly) && (
        <div className="d-flex justify-content-center mt-3 mb-3">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      )}
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
