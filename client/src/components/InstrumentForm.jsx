/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Portal } from '@material-ui/core';
import { CustomInput, CustomButton } from './CustomFormComponents';
import UserContext from './UserContext';
import ModalAlert from './ModalAlert';
// eslint-disable-next-line import/no-cycle
import EditInstrument from './EditInstrument';

import AsyncSuggest from './AsyncSuggest';
import TagsInput from './TagsInput';

const GET_MODELS_QUERY = gql`
  query Models {
    getAllModels {
      modelNumber
      vendor
      calibrationFrequency
      supportLoadBankCalibration
      description
    }
  }
`;
const query = GET_MODELS_QUERY;
const queryName = 'getAllModels';

const charLimits = {
  comment: {
    max: 2000,
  },
  assetTag: {
    min: 100000,
    max: 999999,
  },
  serialNumber: {
    max: 40,
  },
};

const schema = Yup.object({
  vendor: Yup.string()
    .required('Please select a model'),
  modelNumber: Yup.string()
    .required('Please select a model'),
  serialNumber: Yup.string()
    .max(charLimits.serialNumber.max, `Must be less than ${charLimits.serialNumber.max} characters`),
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
  type,
  deleteBtn,
  footer,
  updateCalibrationFrequency,
  id = null,
  editBtnRef = null,
  hideLongFields = false,
}) {
  InstrumentForm.propTypes = {
    modelNumber: PropTypes.string,
    vendor: PropTypes.string,
    comment: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    assetTag: PropTypes.number.isRequired,
    handleFormSubmit: PropTypes.func,
    serialNumber: PropTypes.string.isRequired,
    viewOnly: PropTypes.bool, // If true, then the fields are disabled and no input changes can be made
    description: PropTypes.string,
    calibrationFrequency: PropTypes.number,
    type: PropTypes.string.isRequired,
    deleteBtn: PropTypes.node, // delete btn to be displayed for edit instrument
    footer: PropTypes.node, // what to display at the bottom of the form
    updateCalibrationFrequency: PropTypes.func, // when to update calib frequenc
    id: PropTypes.number, // id of instrument; used when you want to edit instrument
    editBtnRef: PropTypes.object, // reference to edit button
    hideLongFields: PropTypes.bool, // if you want to hide comment and categories
  };
  InstrumentForm.defaultProps = {
    handleFormSubmit: null,
    viewOnly: false,
    description: '',
    calibrationFrequency: 0,
    updateCalibrationFrequency: () => undefined,
  };
  const disabled = !(typeof viewOnly === 'undefined' || !viewOnly);
  const formatOption = (option) => `${option.vendor} ${option.modelNumber}`;
  const formatSelected = (option, value) => option.modelNumber === value.modelNumber && option.vendor === value.vendor;
  const user = useContext(UserContext);
  const showFooter = type === 'edit' && (user.isAdmin || user.instrumentPermission);
  const footerBtns = (handleSubmit, isSubmitting) => (
    <div className="row">
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
              btnText="Edit Instrument"
              title="Edit Instrument"
              btnClass="btn my-auto text-nowrap"
            >
              <EditInstrument
                initVendor={vendor}
                initModelNumber={modelNumber}
                initSerialNumber={serialNumber}
                id={id}
                description={description}
                footer={footer}
                initAssetTag={assetTag}
                deleteBtn={deleteBtn}
              />
            </ModalAlert>
          </div>
          <div className="col ms-3">{deleteBtn}</div>
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
        setFieldTouched,
        isSubmitting,
        values,
        errors,
        touched,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <div className="row mx-3">
            <div className="col-lg mt-3">
              <Form.Group>
                <div className="d-flex flex-row">
                  <Form.Label className="h5 text-center">
                    Model Selection
                  </Form.Label>
                  <span className="mx-2" />
                  {viewOnly && footer}
                </div>
                {viewOnly ? (
                  // TODO: Can you edit this during change?
                  <Form.Control
                    type="text"
                    name="modelSelection"
                    value={`${values.vendor} ${values.modelNumber}`}
                    disabled={disabled}
                  />
                ) : (
                  <>
                    <AsyncSuggest
                      query={query}
                      queryName={queryName}
                      onInputChange={(e, v) => {
                        setFieldTouched('vendor', true);
                        setFieldValue('vendor', v.vendor);
                        setFieldValue('modelNumber', v.modelNumber);
                        setFieldValue(
                          'calibrationFrequency',
                          v.calibrationFrequency,
                        );
                        updateCalibrationFrequency(v.calibrationFrequency || 0);
                        setFieldValue('description', v.description);
                      }}
                      label="Choose a model"
                      getOptionSelected={formatSelected}
                      getOptionLabel={formatOption}
                      value={{
                        modelNumber: values.modelNumber,
                        vendor: values.vendor,
                      }}
                      isInvalid={values.vendor === '' && touched.vendor}
                      invalidMsg="Please select a model"
                    />
                  </>
                )}
              </Form.Group>
            </div>
            <div className="col-lg mt-3">
              <CustomInput
                placeHolder={disabled ? '' : 'This field is optional'}
                controlId="formAssetTag"
                className="h5"
                label="Asset Tag"
                name="assetTag"
                type="text"
                required
                value={values.assetTag}
                onChange={(e) => {
                  const input = e.target.value;
                  const reg = new RegExp('^[0-9]*$');
                  if (reg.test(input)) {
                    handleChange(e);
                  }
                }}
                disabled={disabled}
                isInvalid={!!errors.assetTag}
                error={errors.assetTag}
              />
            </div>
          </div>
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col-lg mt-3">
              <Form.Group>
                <Form.Label className="h5 text-center text-nowrap ">
                  Calibration Frequency
                </Form.Label>
                <Form.Control
                  type="text"
                  name="calibrationFrequency"
                  value={values.calibrationFrequency}
                  disabled
                />
              </Form.Group>
            </div>
            <div className="col-lg mt-3">
              <Form.Group>
                <Form.Label className="h5 text-center">
                  Model Description
                </Form.Label>
                <Form.Control
                  type="text"
                  name="modelDescription"
                  value={values.description}
                  disabled
                />
              </Form.Group>
            </div>
            {/* TODO: What are problems with serial number? */}
            <div className="col mt-3">
              <CustomInput
                placeHolder={disabled ? '' : 'This field is optional'}
                controlId="formSerialNumber"
                className="h5"
                label="Serial Number"
                name="serialNumber"
                type="text"
                value={values.serialNumber}
                onChange={handleChange}
                disabled={disabled}
                isInvalid={!!errors.serialNumber}
                error={errors.serialNumber}
              />
            </div>
          </div>
          {!hideLongFields && (
            <>
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
              </div>
              <div className="row mx-3 border-top border-dark mt-3">
                <div className="col mt-3">
                  <Form.Label className="h5">Categories</Form.Label>
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
            </>
          )}
          {type === 'create' && (
            <div className="d-flex justify-content-center my-3">
              {isSubmitting ? (
                <CircularProgress />
              ) : (
                <Button type="submit" onClick={handleSubmit}>
                  Add Instrument
                </Button>
              )}
            </div>
          )}

          {showFooter
            && editBtnRef === null && ( // showfooter = type = edit && user has permissions
              <div className="d-flex justify-content-center my-3">
                {footerBtns(handleSubmit, isSubmitting)}
              </div>
          )}
          {showFooter && editBtnRef !== null && (
            <Portal container={editBtnRef.current}>
              {footerBtns(handleSubmit, isSubmitting)}
            </Portal>
          )}
        </Form>
      )}
    </Formik>
  );
}
