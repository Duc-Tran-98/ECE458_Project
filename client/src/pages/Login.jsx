import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import Query from '../components/UseQuery';
import OAuthLogin from '../components/OAuthLogin';

const Login = ({ handleLogin }) => {
  Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };

  const [formState, setFormState] = useState({
    password: '',
    userName: '',
    isChecked: false,
  });
  // const onChangeCheckbox = (event) => {
  //   setFormState({ ...formState, isChecked: event.target.checked });
  // };
  const submitForm = (e) => {
    e.preventDefault();
    const { userName, password } = formState;
    // const hours = 24; // Reset when storage is more than 24hours
    // const now = new Date().getTime();
    // const setupTime = localStorage.getItem('setupTime');
    // if (setupTime == null) {
    //   localStorage.setItem('setupTime', now);
    // } else if (now - setupTime > hours * 60 * 60 * 1000) {
    //   localStorage.clear();
    //   localStorage.setItem('setupTime', now);
    // }
    // if (isChecked && userName !== '' && password !== '') {
    //   localStorage.username = userName;
    //   localStorage.password = password;
    //   localStorage.checkbox = isChecked;
    // } else if (!isChecked && userName !== '' && password !== '') {
    //   localStorage.clear();
    // }
    function getVariables() {
      return { password, userName };
    }
    const LOGIN_MUTATION = gql`
     mutation LoginMutation($password: String!, $userName: String!) {
       login(password: $password, userName: $userName)
     }
   `;
    const queryName = 'login';
    const query = print(LOGIN_MUTATION);
    function handleResponse(response) {
      if (response.success) {
        window.sessionStorage.setItem(
          'token',
          Buffer.from(userName, 'ascii').toString('base64'),
        );
        handleLogin(response.jwt);
      } else {
        toast.error('You have entered an incorrect username/password');
      }
    }
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  };
  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  return (
    <Form className="needs-validation" noValidate onSubmit={submitForm}>
      <ToastContainer />
      <div className="row mx-3 d-flex justify-content-center">
        <div className="col-6 mt-3">
          <Form.Group controlId="formUsername">
            <Form.Label className="h4">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              name="userName"
              value={formState.userName}
              onChange={changeHandler}
              required
            />
          </Form.Group>
        </div>
      </div>
      <div className="row mx-3 mt-3 d-flex justify-content-center">
        <div className="col-6">
          <Form.Group>
            <Form.Label className="h4">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formState.password}
              onChange={changeHandler}
              required
            />
          </Form.Group>
        </div>
      </div>
      {/* <div className="form-check form-switch d-flex align-items-center ms-3">
          <input
            type="checkbox"
            value=""
            className="form-check-input"
            id="customCheck1"
            checked={formState.isChecked}
            onChange={onChangeCheckbox}
          />
          <label className="form-check-label ms-2" htmlFor="customCheck1">
            Remember me
          </label>
        </div> */}
      <div className="d-flex flex-column my-3">
        <button className="btn mx-auto" type="submit">
          Log In
        </button>
        <div className="mx-auto mt-3">
          <OAuthLogin />
        </div>
      </div>
      {/* <div className="d-flex justify-content-center">
          <p className="text-muted">
            Forgot
            {' '}
            <a href="/">password?</a>
          </p>
        </div> */}
    </Form>
  );
};

export default Login;
