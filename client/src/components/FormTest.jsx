import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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

const charLimits = {
  modelNumber: {
    max: 40,
  },
  vendor: {
    max: 30,
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
//   vendor: Yup.string()
//     .max(charLimits.vendor.max, `Must be less than ${charLimits.vendor.max} characters`)
//     .required('Vendor is required'),
//   calibrationFrequency: Yup.number().integer(),
//   comment: Yup.string()
//     .max(charLimits.comment.max, `Must be less than ${charLimits.comment.max} characters`),
//   description: Yup.string()
//     .max(charLimits.description.max, `Must be less than ${charLimits.description.max} characters`),
});

const initialValues = {
  modelNumber: '',
  vendor: '',
  calibrationFrequency: '0',
  comment: '',
  description: '',
};

export default function FormTest() {
  return (
    <>
      <h1>Formik Form Test</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            resetForm();
            setSubmitting(false);
          }, 3000);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          isSubmitting,
          values,
          errors,
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
          >
            <CustomInput
              controlId="formModelNumber"
              className="h4"
              label="Model Number"
              name="modelNumber"
              type="text"
              required
              value={values.modelNumber}
              onChange={handleChange}
              disabled={false}
              isInvalid={!!errors.modelNumber}
              error={errors.modelNumber}
            />
            <Button type="submit" onClick={handleSubmit}>{isSubmitting ? 'Loading...' : 'Submit'}</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
