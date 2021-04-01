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
  plaintext: '',
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
          <div
            className="m-2"
            style={{ width: '50vw' }}
          >
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
              <Form.Group controlId="plaintext" className="col mt-3">
                <Form.Control
                  name="plaintext"
                  value={values.plaintext}
                  placeholder="Plaintext"
                  onChange={handleChange}
                  isInvalid={touched.plaintext && !!errors.plaintext}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.plaintext}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}
