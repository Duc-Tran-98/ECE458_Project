/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CustomInput } from './CustomFormComponents';

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

const charLimits = {
  comment: {
    max: 2000,
  },
  assetTag: {
    min: 100000,
    max: 999999,
  },
};

const schema = Yup.object({
  vendor: Yup.string()
    .required('Model is required'),
  assetTag: Yup.number().integer()
    .max(charLimits.assetTag.max, `Must be less than ${charLimits.assetTag.max}`)
    .min(charLimits.assetTag.min, `Must be greater than ${charLimits.assetTag.min}`),
  comment: Yup.string()
    .max(charLimits.comment.max, `Must be less than ${charLimits.comment.max} characters`),
});

export default function InstrumentForm({
  comment,
  handleFormSubmit,
  assetTag,
  serialNumber,
  categories,
  viewOnly,
  modelNumber,
  vendor,
  description,
  calibrationFrequency,
}) {
  InstrumentForm.propTypes = {
    modelNumber: PropTypes.string,
    vendor: PropTypes.string,
    comment: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    assetTag: PropTypes.string.isRequired,
    handleFormSubmit: PropTypes.func,
    serialNumber: PropTypes.string.isRequired,
    viewOnly: PropTypes.bool, // If true, then the fields are disabled and no input changes can be made
    description: PropTypes.string,
    calibrationFrequency: PropTypes.number,
  };
  InstrumentForm.defaultProps = {
    handleFormSubmit: null,
    viewOnly: false,
    description: '',
    calibrationFrequency: 0,
  };
  const disabled = !(typeof viewOnly === 'undefined' || !viewOnly);
  const formatOption = (option) => `${option.vendor} ${option.modelNumber}`;
  const formatSelected = (option, value) => option.modelNumber === value.modelNumber && option.vendor === value.vendor;
  return (
    <Formik
      initialValues={{
        modelNumber: modelNumber || '',
        vendor: vendor || '',
        calibrationFrequency: calibrationFrequency || '0',
        serialNumber: serialNumber || '',
        assetTag: assetTag || '',
        comment: comment || '',
        description: description || '',
        categories: categories || [],
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setTimeout(() => {
          handleFormSubmit(values, resetForm);
          setSubmitting(false);
        }, 500);
      }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        isSubmitting,
        values,
        errors,
        // touched,
      }) => (
        <Form
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="row mx-3">
            <div className="col mt-3">
              <Form.Group>
                <Form.Label className="h4 text-center">Model Selection</Form.Label>
                {viewOnly ? (
                  // TODO: Can you edit this during change?
                  <Form.Control
                    type="text"
                    name="modelSelection"
                    value={`${values.vendor} ${values.modelNumber}`}
                    disabled={disabled}
                  />
                ) : (
                  <AsyncSuggest
                    query={query}
                    queryName={queryName}
                    onInputChange={(e, v) => {
                      setFieldValue('vendor', v.vendor);
                      setFieldValue('modelNumber', v.modelNumber);
                    }}
                    label="Choose a model"
                    getOptionSelected={formatSelected}
                    getOptionLabel={formatOption}
                    value={{ vendor: values.vendor, modelNumber: values.modelNumber }}
                    isInvalid={!!errors.vendor && !!errors.modelNumber}
                  />
                )}
              </Form.Group>
            </div>
            <div className="col mt-3">
              <CustomInput
                controlId="formAssetTag"
                className="h4"
                label="Asset Tag"
                name="assetTag"
                type="number"
                required
                value={values.assetTag}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={!!errors.assetTag}
                error={errors.assetTag}
              />
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
                  value={values.serialNumber}
                  onChange={handleChange}
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
                  value={values.comment}
                  onChange={handleChange}
                  disabled={disabled}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Label className="h4">Categories</Form.Label>
              <TagsInput
                selectedTags={(tags) => {
                  setFieldValue('categories', tags);
                }}
                tags={values.categories}
                dis={disabled}
                models={false}
                isInvalid={false}
              />
            </div>
          </div>
          {handleSubmit && (
          <div className="d-flex justify-content-center my-3">
            {isSubmitting
              ? <CircularProgress />
              : <Button type="submit" onClick={handleSubmit}>Add Instrument</Button>}
          </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
