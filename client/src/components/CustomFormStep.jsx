import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

const schema = Yup.object({
  header: Yup.string().required('Please enter Header'),
});

const initialValues = {
  header: '',
};

export default function CustomFormStep({ editing }) {
  CustomFormStep.propTypes = {
    editing: PropTypes.bool.isRequired,
  };

  console.log(`editing: ${editing}`);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          errors,
          values,
          touched,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="header" className="col mt-3">
              <Form.Control
                name="header"
                value={values.header}
                placeholder="Header"
                onChange={handleChange}
                isInvalid={touched.header && !!errors.header}
              />
              <Form.Control.Feedback type="invalid">
                {errors.header}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </>
  );
}
