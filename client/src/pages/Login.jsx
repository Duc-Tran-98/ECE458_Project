import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import axios from 'axios';
import PropTypes from 'prop-types';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4000'
  : '/api';

const Login = (props) => {
  Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };

  const LOGIN_MUTATION = gql`
    mutation LoginMutation($password: String!, $userName: String!) {
      login(password: $password, userName: $userName)
    }
  `;
  const [formState, setFormState] = useState({
    password: '',
    userName: '',
    isChecked: false,
  });
  useEffect(() => {
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, (form) => {
      form.addEventListener(
        'submit',
        (event) => {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        },
        false,
      );
    });
  });
  const onChangeCheckbox = (event) => {
    setFormState({ ...formState, isChecked: event.target.checked });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    const { isChecked, userName, password } = formState;
    const hours = 24; // Reset when storage is more than 24hours
    const now = new Date().getTime();
    const setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
      localStorage.setItem('setupTime', now);
    } else if (now - setupTime > hours * 60 * 60 * 1000) {
      localStorage.clear();
      localStorage.setItem('setupTime', now);
    }
    if (isChecked && userName !== '' && password !== '') {
      localStorage.username = userName;
      localStorage.password = password;
      localStorage.checkbox = isChecked;
    } else if (!isChecked && userName !== '' && password !== '') {
      localStorage.clear();
    }
    axios
      .post(route, {
        query: print(LOGIN_MUTATION),
        variables: {
          password: formState.password,
          userName: formState.userName,
        },
      })
      .then((res) => {
        if (res.data.data.login) {
          alert('Successfully Logged in!');
          // window.location.href = "/";
          props.handleLogin();
        } else {
          alert('Invalid username/password');
        }
      })
      .catch((err) => console.log(err));
  };
  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <form
        className="needs-validation bg-light rounded"
        noValidate
        onSubmit={handleLogin}
      >
        <div className="form-row">
          <div className="col pl-3 pr-3">
            <label htmlFor="validationCustomUsername" className="h4">
              Username
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend">
                  @
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="validationCustomUsername"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                name="userName"
                value={formState.userName}
                onChange={changeHandler}
                required
              />
              <div className="invalid-feedback">Please enter a username.</div>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="col pl-3 pr-3">
            <label htmlFor="validationCustom04" className="h4">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="validationCustom04"
              name="password"
              value={formState.password}
              onChange={changeHandler}
              required
            />
            <div className="invalid-feedback">
              Please provide a valid password.
            </div>
          </div>
        </div>
        <div className="form-check d-flex align-items-center ml-3">
          <input
            type="checkbox"
            value=""
            className="form-check-input"
            id="customCheck1"
            checked={formState.isChecked}
            onChange={onChangeCheckbox}
          />
          <label className="form-check-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
        <div className="d-flex justify-content-center mb-3 mt-3">
          <button className="btn btn-primary" type="submit">
            Log In
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <p className="text-muted">
            Forgot
            {' '}
            <a href="/">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
