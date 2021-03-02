import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

export default function PasswordForm({ handleSubmitPassword }) {
  PasswordForm.propTypes = {
    handleSubmitPassword: PropTypes.func.isRequired,
  };

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const resetForm = () => {
    setPassword({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const changeHandler = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const validated = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = 0;
    if (password.newPassword !== password.confirmPassword) {
      err += 1;
      toast.error('Passwords do not match');
    }
    if (!err) {
      resetForm();
      handleSubmitPassword(password.currentPassword, password.newPassword, password.confirmPassword);
    }
  };

  return (
    <>
      <ToastContainer />
      <Form
        className="needs-validation"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="row mx-3">
          <div className="col mt-3">
            <Form.Group controlId="formCurrentPassword">
              <Form.Label className="h5">Current Password</Form.Label>
              <Form.Control
                name="currentPassword"
                type="password"
                required
                onChange={changeHandler}
                value={password.currentPassword}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label className="h5">New Password</Form.Label>
              <Form.Control
                name="newPassword"
                type="password"
                required
                onChange={changeHandler}
                value={password.newPassword}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label className="h5">Confirm New Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                required
                onChange={changeHandler}
                value={password.confirmPassword}
              />
            </Form.Group>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3 mb-3">
          <button type="submit" className="btn ">
            Update Password
          </button>
        </div>
      </Form>
    </>
  );
}
