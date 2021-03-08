import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Yup from 'yup';

import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

const schema = Yup.object({
  currentPassword: Yup.string()
    .required('Please enter current password'),
});

export default function PasswordForm({ handleSubmitPassword }) {
  PasswordForm.propTypes = {
    handleSubmitPassword: PropTypes.func.isRequired,
  };

  const isEmpty = (newPassword, confirmPassword) => (!newPassword && !confirmPassword);
  const isValidPassword = (newPassword, confirmPassword) => !isEmpty(newPassword, confirmPassword) && newPassword === confirmPassword;
  const isInvalidPassword = (newPassword, confirmPassword) => !isEmpty(newPassword, confirmPassword) && !isValidPassword(newPassword, confirmPassword);

  return (

    <Formik
      validationSchema={schema}
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setTimeout(() => {
          handleSubmitPassword(values, resetForm);
          setSubmitting(false);
        }, 500);
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
          className="m-4"
        >
          <h2>Update Password</h2>
          <div className="row mt-3">
            <Form.Group controlId="formCurrentPassword" className="col mt-3">
              <Form.Label className="p">Current Password</Form.Label>
              <Form.Control
                name="currentPassword"
                type="password"
                required
                onChange={handleChange}
                value={values.currentPassword}
                isInvalid={!!errors.currentPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="col mt-3">
              <Form.Label className="p">New Password</Form.Label>
              <Form.Control
                name="newPassword"
                type="password"
                required
                onChange={handleChange}
                value={values.newPassword}
                isInvalid={isInvalidPassword(values.newPassword, values.confirmPassword)}
                isValid={isValidPassword(values.newPassword, values.confirmPassword)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="col mt-3">
              <Form.Label className="p">Confirm New Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                required
                onChange={handleChange}
                value={values.confirmPassword}
                isInvalid={isInvalidPassword(values.newPassword, values.confirmPassword)}
                isValid={isValidPassword(values.newPassword, values.confirmPassword)}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                Looks great
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="d-flex justify-content-center mt-3 mb-3">
            {isSubmitting
              ? <CircularProgress /> : (
                <button type="submit" className="btn ">
                  Update Password
                </button>
              )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
