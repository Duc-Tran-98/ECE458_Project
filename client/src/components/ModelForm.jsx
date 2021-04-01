/* eslint-disable react/require-default-props */
import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Portal } from '@material-ui/core';
import AsyncSuggest from './AsyncSuggest';
import TagsInput from './TagsInput';
import UserContext from './UserContext';
import { CustomButton, CustomInput } from './CustomFormComponents';
import ModalAlert from './ModalAlert';
// eslint-disable-next-line import/no-cycle
import EditModel from './EditModel';

const GET_MODELS_QUERY = gql`
  query Models {
    getUniqueVendors {
      vendor
    }
  }
`;
const query = GET_MODELS_QUERY;
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
    .max(charLimits.description.max, `Must be less than ${charLimits.description.max} characters`)
    .required('Description is required'),
});

export default function ModelForm({
  modelNumber, vendor, calibrationFrequency, comment, description, categories, supportLoadBankCalibration, supportKlufeCalibration, supportCustomCalibration, requiresCalibrationApproval, handleFormSubmit, viewOnly, diffSubmit, deleteBtn, type, editBtnRef = null,
}) {
  ModelForm.propTypes = {
    modelNumber: PropTypes.string,
    vendor: PropTypes.string,
    calibrationFrequency: PropTypes.string,
    comment: PropTypes.string,
    description: PropTypes.string,
    supportLoadBankCalibration: PropTypes.bool,
    supportKlufeCalibration: PropTypes.bool,
    supportCustomCalibration: PropTypes.bool,
    requiresCalibrationApproval: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array,
    handleFormSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/require-default-props
    viewOnly: PropTypes.bool,
    diffSubmit: PropTypes.bool, // whether or not to display own submit button
    deleteBtn: PropTypes.node,
    type: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    editBtnRef: PropTypes.object,
  };
  ModelForm.defaultProps = {
    modelNumber: '',
    vendor: '',
    calibrationFrequency: '0',
    comment: '',
    description: '',
    supportLoadBankCalibration: false,
    supportKlufeCalibration: false,
    supportCustomCalibration: false,
    requiresCalibrationApproval: false,
    categories: [],
    diffSubmit: false,
    deleteBtn: null,
    type: 'create',
  };

  const user = useContext(UserContext);
  const showFooter = type === 'edit' && (user.isAdmin || user.modelPermission);
  const cats = [];
  if (categories) categories.forEach((el) => cats.push(el));
  const disabled = !((typeof viewOnly === 'undefined' || !viewOnly));
  const formatOption = (option) => `${option.vendor}`;
  const formatSelected = (option, value) => option.vendor === value.vendor;
  const footerBtns = (handleSubmit, isSubmitting) => (
    <div className="row">
      {/* <CustomButton onClick={handleDelete} divClass="col" buttonClass="btn btn-danger" buttonLabel="Delete Model" /> */}
      {!viewOnly
          && (isSubmitting ? (
            <CircularProgress />
          ) : (
            <CustomButton
              onClick={handleSubmit}
              divClass="col"
              buttonClass="btn text-nowrap"
              buttonLabel="Save Changes"
            />
          ))}
      {viewOnly && (
      <>
        <div className="col me-3">
          <ModalAlert
            btnText="Edit Model"
            title="Edit Model"
            btnClass="btn my-auto text-nowrap"
          >
            <EditModel
              initModelNumber={modelNumber}
              initVendor={vendor}
              deleteBtn={deleteBtn}
            />
          </ModalAlert>
        </div>
        <div className="col-auto ms-3">{deleteBtn}</div>
      </>
      )}
    </div>
  );
  return (
    <Formik
      initialValues={{
        modelNumber: modelNumber || '',
        vendor: vendor || '',
        calibrationFrequency: calibrationFrequency || '0',
        comment: comment || '',
        description: description || '',
        categories: categories || [],
        supportLoadBankCalibration: supportLoadBankCalibration || false,
        supportKlufeCalibration: supportKlufeCalibration || false,
        supportCustomCalibration: supportCustomCalibration || false,
        requiresCalibrationApproval: requiresCalibrationApproval || false,
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
        touched,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="col">
          <div className="row mx-3">
            <div className="col mt-3">
              <Form.Group>
                <Form.Label className="h5">Vendor</Form.Label>
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
                      if (v !== null) {
                        setFieldValue(
                          'vendor',
                          v.inputValue ? v.inputValue : v.vendor,
                        );
                      }
                    }}
                    label="Choose a vendor"
                    getOptionSelected={formatSelected}
                    getOptionLabel={formatOption}
                    value={
                      values.vendor.length > 0
                        ? { vendor: values.vendor }
                        : null
                    }
                    isInvalid={touched.vendor && !!errors.vendor}
                    invalidMsg="Please select a vendor"
                    allowAdditions
                  />
                )}
              </Form.Group>
            </div>
            <div className="col mt-3">
              <CustomInput
                controlId="formModelNumber"
                className="h5"
                label="Model Number"
                name="modelNumber"
                type="text"
                required
                value={values.modelNumber}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={touched.modelNumber && !!errors.modelNumber}
                error={errors.modelNumber}
              />
            </div>
          </div>
          {/* TODO: Calibration frequency ONLY accept numeric values */}
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <CustomInput
                controlId="formCalibrationFrequency"
                className="h5 text-nowrap"
                label="Calibration Frequency"
                name="calibrationFrequency"
                type="text"
                required={false}
                value={values.calibrationFrequency}
                onChange={(e) => {
                  const input = e.target.value;
                  const reg = new RegExp('^[0-9]*$');
                  if (reg.test(input)) {
                    handleChange(e);
                  }
                }}
                disabled={disabled}
                isInvalid={!!errors.calibrationFrequency}
                error={errors.calibrationFrequency}
              />
            </div>
            <div className="col mt-3">
              <CustomInput
                controlId="formDescription"
                className="h5"
                label="Description"
                name="description"
                type="text"
                required
                value={values.description}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={touched.description && !!errors.description}
                error={errors.description}
              />
            </div>
          </div>
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Group controlId="formComment">
                <Form.Label className="h5">Comment</Form.Label>
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
                <Form.Control.Feedback type="invalid">
                  {errors.comment}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col mt-3">
              <div className="form-check form-switch mt-4">
                <label
                  className="form-check-label h5 col"
                  htmlFor="custom-support"
                >
                  Does calibration require approval??
                </label>
                <Form.Control
                  className="form-check-input"
                  type="checkbox"
                  id="requires-approval"
                  name="requiresCalibrationApproval"
                  checked={values.requiresCalibrationApproval}
                  onChange={handleChange}
                  disabled={disabled}
                />
                <div className="col">
                  <strong>
                    {values.requiresCalibrationApproval ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>
              <div className="form-check form-switch mt-4">
                <label
                  className="form-check-label h5 col"
                  htmlFor="load-bank-support"
                >
                  Can model be calibrated as load bank?
                </label>
                <Form.Control
                  className="form-check-input"
                  type="checkbox"
                  id="load-bank-support"
                  name="supportLoadBankCalibration"
                  checked={values.supportLoadBankCalibration}
                  onChange={handleChange}
                  disabled={disabled}
                />
                <div className="col">
                  <strong>
                    {values.supportLoadBankCalibration ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>
              <div className="form-check form-switch mt-4">
                <label
                  className="form-check-label h5 col"
                  htmlFor="klufe-support"
                >
                  Can model be calibrated with Klufe 5700?
                </label>
                <Form.Control
                  className="form-check-input"
                  type="checkbox"
                  id="klufe-support"
                  name="supportKlufeCalibration"
                  checked={values.supportKlufeCalibration}
                  onChange={handleChange}
                  disabled={disabled}
                />
                <div className="col">
                  <strong>
                    {values.supportKlufeCalibration ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>
              <div className="form-check form-switch mt-4">
                <label
                  className="form-check-label h5 col"
                  htmlFor="custom-support"
                >
                  Can model be calibrated with custom form?
                </label>
                <Form.Control
                  className="form-check-input"
                  type="checkbox"
                  id="custom-support"
                  name="supportCustomCalibration"
                  checked={values.supportCustomCalibration}
                  onChange={handleChange}
                  disabled={disabled}
                />
                <div className="col">
                  <strong>
                    {values.supportCustomCalibration ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
          {/* TODO: Ensure tags are added into the db (not rendering on view)  */}
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Label className="h5">Categories</Form.Label>
              <TagsInput
                selectedTags={(tags) => {
                  setFieldValue('categories', tags);
                }}
                tags={values.categories}
                dis={disabled}
                models
                isInvalid={false}
              />
            </div>
          </div>
          {(typeof viewOnly === 'undefined' || !viewOnly)
            && !diffSubmit
            && type === 'create' && (
              <div className="d-flex justify-content-center mt-3 mb-3">
                {isSubmitting ? (
                  <CircularProgress />
                ) : (
                  <Button type="submit" onClick={handleSubmit}>
                    Add Model
                  </Button>
                )}
              </div>
          )}
          {showFooter && editBtnRef !== null && (
            <Portal container={editBtnRef.current}>
              {footerBtns(handleSubmit, isSubmitting)}
            </Portal>
          )}
          {showFooter && editBtnRef === null && (
            <div className="d-flex justify-content-center my-3">
              {footerBtns(handleSubmit, isSubmitting)}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
