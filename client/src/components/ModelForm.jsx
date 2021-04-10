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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AsyncSuggest from './AsyncSuggest';
import TagsInput from './TagsInput';
import UserContext from './UserContext';
import { CustomButton, CustomInput } from './CustomFormComponents';
import ModalAlert from './ModalAlert';
// eslint-disable-next-line import/no-cycle
import EditModel from './EditModel';
import CustomFormBuilder from './CustomFormBuilder';
import AccordionWrapper from './AccordionWrapper';
import {
  emptyHeader,
} from './FormContsants';

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
  modelNumber, vendor, calibrationFrequency, comment, description, categories, calibratorCategories, supportLoadBankCalibration, supportKlufeCalibration, supportCustomCalibration, requiresCalibrationApproval, handleFormSubmit, viewOnly, diffSubmit, deleteBtn, type, editBtnRef = null, customForm,
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
    // eslint-disable-next-line react/forbid-prop-types
    calibratorCategories: PropTypes.array,
    handleFormSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/require-default-props
    viewOnly: PropTypes.bool,
    diffSubmit: PropTypes.bool, // whether or not to display own submit button
    deleteBtn: PropTypes.node,
    type: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    editBtnRef: PropTypes.object,
    customForm: PropTypes.string,
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
    calibratorCategories: [],
    diffSubmit: false,
    deleteBtn: null,
    type: 'create',
    customForm: '',
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
  console.log(`customForm prop: ${customForm}`);
  const initCustomFormState = customForm !== '' ? JSON.parse(customForm) : [emptyHeader];
  console.log('initCustomFormState: ');
  console.log(initCustomFormState);
  const [customFormState, setCustomFormState] = React.useState(initCustomFormState);
  const [shouldUpdateCustomForm, setShouldUpdateCustomForm] = React.useState(0);

  // Helper function to validate custom form
  // Iterates through form state, assigning errors
  // If errors exist, then return false, else return true
  const validCustomForm = () => {
    console.log('validatingCustomForm');
    console.log(customFormState);
    const nextState = customFormState;
    let errorCount = 0;
    customFormState.forEach((element, index) => {
      console.log(element);
      console.log(index);
      const isEmpty = element.prompt === '';
      if (isEmpty) {
        console.log('found empty field');
        errorCount += 1;
        nextState[index] = {
          ...nextState[index],
          error: true,
          helperText: 'Please enter a prompt',
        };
      }
    });
    console.log(`inspected all fields, errorCount=${errorCount}\nsettingFormState: `);
    console.log(nextState);
    setCustomFormState(nextState);
    setShouldUpdateCustomForm(shouldUpdateCustomForm + 1);
    return errorCount === 0;
  };

  const getCalibrationType = () => {
    if (supportCustomCalibration) { return 'customForm'; }
    if (supportKlufeCalibration) { return 'klufe'; }
    if (supportLoadBankCalibration) { return 'loadBank'; }
    return 'standard';
  };
  const initCalibrationType = getCalibrationType();
  // console.log(`initCalibrationType: ${initCalibrationType}`);

  // Check if errors should be removed from custom form
  React.useEffect(() => {
    const nextState = customFormState;
    customFormState.forEach((element, index) => {
      if (element.error === true && element.helperText === 'Please enter a prompt') {
        console.log('found previously field');
        if (element.prompt !== '') {
          nextState[index] = {
            ...nextState[index],
            error: false,
            helperText: '',
          };
        }
      }
    });
    setCustomFormState(nextState);
    setShouldUpdateCustomForm(shouldUpdateCustomForm + 1);
  }, [customFormState]);

  return (
    <Formik
      initialValues={{
        modelNumber: modelNumber || '',
        vendor: vendor || '',
        calibrationFrequency: calibrationFrequency || '0',
        comment: comment || '',
        description: description || '',
        categories: categories || [],
        calibratorCategories: calibratorCategories || [],
        requiresCalibrationApproval: requiresCalibrationApproval || false,
        calibrationType: initCalibrationType,
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // First, validate custom form has no errors
        console.log('onSubmit in Formik ModelForm');
        if (!validCustomForm()) {
          console.log('custom form is invalid, returning');
          setSubmitting(false);
          return;
        }
        console.log('validated custom form, submitting');
        const filteredValues = {
          modelNumber: values.modelNumber,
          vendor: values.vendor,
          calibrationFrequency: values.calibrationFrequency,
          comment: values.comment,
          description: values.description,
          categories: values.categories,
          calibratorCategories: values.calibratorCategories,
          requiresCalibrationApproval: values.requiresCalibrationApproval,
          supportCustomCalibration: values.calibrationType.includes('custom'),
          supportKlufeCalibration: values.calibrationType.includes('klufe'),
          supportLoadBankCalibration: values.calibrationType.includes('load'),
          customForm: JSON.stringify(customFormState),
        };
        console.log(filteredValues);
        console.log('setting submit to true');
        setSubmitting(true);
        setTimeout(() => {
          handleFormSubmit(filteredValues, resetForm);
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
            <Form.Group controlId="formComment">
              <Form.Label className="h5 mt-3">Comment</Form.Label>
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
          {/* TODO: Ensure tags are added into the db (not rendering on view)  */}
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Label className="h5">Model Categories</Form.Label>
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
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Label className="h5">Calibrator Categories</Form.Label>
              <TagsInput
                selectedTags={(tags) => {
                  setFieldValue('calibratorCategories', tags);
                }}
                tags={values.calibratorCategories}
                dis={disabled}
                models
                isInvalid={false}
              />
            </div>
          </div>
          <div className="row mx-3 border-top border-dark mt-3">
            <Form.Label className="h5 mt-3">Calibration Information</Form.Label>
            <div className="col">
              <FormControlLabel
                control={<Checkbox checked={values.requiresCalibrationApproval} name="requiresCalibrationApproval" onChange={handleChange} color="primary" />}
                label="Requires Approval"
                disabled={disabled}
              />
            </div>
            <div className="col-auto">
              <RadioGroup row aria-label="calibrationType" name="calibrationType" value={values.calibrationType} onChange={handleChange}>
                <FormControlLabel value="standard" disabled={disabled} control={<Radio color="primary" />} label="Standard" />
                <FormControlLabel value="loadBank" disabled={disabled} control={<Radio color="primary" />} label="Load Bank" />
                <FormControlLabel value="klufe" disabled={disabled} control={<Radio color="primary" />} label="Klufe 5700" />
                <FormControlLabel value="customForm" disabled={disabled} control={<Radio color="primary" />} label="Custom Form" />
              </RadioGroup>
            </div>
          </div>
          {values.calibrationType === 'customForm' && (
            <div className="mt-2">
              <AccordionWrapper
                header="Custom Form"
                contents={(
                  <CustomFormBuilder
                    handleSave={(customFormJSON) => setFieldValue('customForm', customFormJSON)}
                    state={customFormState}
                    setState={setCustomFormState}
                    update={shouldUpdateCustomForm}
                  />
            )}
              />
            </div>
          )}
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
