import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AsyncSuggest from './AsyncSuggest';
import TagsInput from './TagsInput';

const GET_MODELS_QUERY = gql`
  query Models {
    getUniqueVendors {
      vendor
    }
  }
`;
const query = print(GET_MODELS_QUERY);
const queryName = 'getUniqueVendors';

// Schema information for form validation
const charLimits = {
  modelNumber: {
    max: 40,
  },
  vendor: {
    max: 30,
  },
  calibrationFrequency: {
    max: 10000,
    min: 0,
  },
  comment: {
    max: 2000,
  },
  description: {
    max: 100,
  },
};

const schema = Yup.object({
  modelNumber: Yup.string()
    .max(charLimits.modelNumber.max, `Must be less than ${charLimits.modelNumber.max} characters`)
    .required('Model Number is required'),
  vendor: Yup.string()
    .max(charLimits.vendor.max, `Must be less than ${charLimits.vendor.max} characters`)
    .required('Vendor is required'),
  calibrationFrequency: Yup.number().integer()
    .min(charLimits.calibrationFrequency.min, `Must be greater than ${charLimits.calibrationFrequency.min} days`)
    .max(charLimits.calibrationFrequency.max, `Must be less than ${charLimits.calibrationFrequency.max} days`),
  comment: Yup.string()
    .max(charLimits.comment.max, `Must be less than ${charLimits.comment.max} characters`),
  description: Yup.string()
    .max(charLimits.description.max, `Must be less than ${charLimits.description.max} characters`),
});

const CustomInput = ({
  // eslint-disable-next-line react/prop-types
  controlId, className, label, name, type, required, value, onChange, disabled, isInvalid, error,
}) => (
  <>
    <Form.Group controlId={controlId}>
      <Form.Label className={className}>{label}</Form.Label>
      <Form.Control
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        isInvalid={isInvalid}
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  </>
);

export default function ModelForm({
  modelNumber, vendor, calibrationFrequency, comment, description, categories, handleFormSubmit, viewOnly, diffSubmit,
}) {
  ModelForm.propTypes = {
    modelNumber: PropTypes.string,
    vendor: PropTypes.string,
    calibrationFrequency: PropTypes.string,
    comment: PropTypes.string,
    description: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array,
    handleFormSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/require-default-props
    viewOnly: PropTypes.bool,
    diffSubmit: PropTypes.bool, // whether or not to display own submit button
  };
  ModelForm.defaultProps = {
    modelNumber: '',
    vendor: '',
    calibrationFrequency: '0',
    comment: '',
    description: '',
    categories: [],
    diffSubmit: false,
  };
  // const selectedTags = (tags) => {
  //   const event = {
  //     target: {
  //       name: 'categories',
  //       value: tags,
  //     },
  //   };
  //   changeHandler(event);
  // };
  const cats = [];
  if (categories) categories.forEach((el) => cats.push(el));
  const disabled = !((typeof viewOnly === 'undefined' || !viewOnly));
  const formatOption = (option) => `${option.vendor}`;
  const formatSelected = (option, value) => option.vendor === value.vendor;

  return (
    <Formik
      initialValues={{
        modelNumber,
        vendor,
        calibrationFrequency,
        comment,
        description,
        categories,
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log('Submitting Formik form');
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          resetForm();
          setSubmitting(false);
          handleFormSubmit(values);
        }, 1000);
      }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        isSubmitting,
        values,
        errors,
      }) => (

        <Form
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="row mx-3">
            <div className="col mt-3">
              <CustomInput
                controlId="formModelNumber"
                className="h4"
                label="Model Number"
                name="modelNumber"
                type="text"
                required
                value={values.modelNumber}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={!!errors.modelNumber}
                error={errors.modelNumber}
              />
            </div>
            <div className="col mt-3">
              <Form.Group>
                <Form.Label className="h4">Vendor</Form.Label>
                {viewOnly ? (
                  <Form.Control
                    type="text"
                    name="modelSelection"
                    value={values.vendor}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                ) : (
                  <AsyncSuggest
                    query={query}
                    queryName={queryName}
                    onInputChange={(e, v) => {
                      const newVendor = v.inputValue ? v.inputValue : v.vendor;
                      setFieldValue('vendor', newVendor);
                      console.log(`Set vendor to: ${newVendor}`);
                    }}
                    label="Choose a vendor"
                    getOptionSelected={formatSelected}
                    getOptionLabel={formatOption}
                    value={{ vendor: values.vendor }}
                    allowAdditions
                  />
                )}
              </Form.Group>
            </div>
          </div>
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <CustomInput
                controlId="formCalibrationFrequency"
                className="h4 text-nowrap"
                label="Calibration Frequency"
                name="calibrationFrequency"
                type="number"
                required={false}
                value={values.calibrationFrequency}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={!!errors.calibrationFrequency}
                error={errors.calibrationFrequency}
              />
            </div>
            <div className="col mt-3">
              <CustomInput
                controlId="formDescription"
                className="h4"
                label="Description"
                name="description"
                type="text"
                required
                value={values.description}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={!!errors.description}
                error={errors.description}
              />
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
                  isInvalid={!!errors.comment}
                  error={errors.comment}
                />
              </Form.Group>
            </div>
          </div>
          {/* TODO: Add tags to formik */}
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Label className="h4">Categories</Form.Label>
              <TagsInput
                selectedTags={(tags) => {
                  console.log('setting categories to: ');
                  console.log(tags);
                  setFieldValue('categories', tags);
                }}
                tags={values.categories}
                dis={disabled}
                models
              />
            </div>
          </div>
          {((typeof viewOnly === 'undefined' || !viewOnly) && !diffSubmit) && (
            <div className="d-flex justify-content-center mt-3 mb-3">
              {/* TODO: Circular progress replace button on submit */}
              {isSubmitting
                ? <CircularProgress />
                : <Button type="submit" onClick={handleSubmit}>Add Model</Button>}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
