import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import axios from 'axios';

const SignUp = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userName: '',
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
  const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
      $email: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $userName: String!
    ) {
      signup(
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        userName: $userName
      )
    }
  `;

  const validateState = () => {
    const {
      firstName, lastName, email, password,
    } = formState;
    return (
      firstName.length > 0
      && lastName.length > 0
      && email.length > 0
      && password.length > 0
    );
  };
  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateState() && true) {
      axios
        .post('/api', {
          query: print(SIGNUP_MUTATION),
          variables: {
            firstName: formState.firstName,
            email: formState.email,
            password: formState.password,
            lastName: formState.lastName,
            userName: formState.userName,
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.data.data.signup) {
            alert('Successfully Registered!');
            window.location.href = '/';
          } else {
            alert('That username/email is already taken');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <form
        className="needs-validation bg-light rounded"
        noValidate
        onSubmit={handleSignup}
      >
        <div className="form-row ml-3 mr-3">
          <div className="col-md-4 mb-3">
            <label htmlFor="validationCustom01" className="h4">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="validationCustom01"
              placeholder="First name"
              name="firstName"
              value={formState.firstName}
              onChange={changeHandler}
              required
            />
            <div className="valid-feedback">Looks good!</div>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="validationCustom02" className="h4">
              Last name
            </label>
            <input
              type="text"
              className="form-control"
              id="validationCustom02"
              placeholder="Last name"
              name="lastName"
              value={formState.lastName}
              onChange={changeHandler}
              required
            />
            <div className="valid-feedback">Looks good!</div>
          </div>
          <div className="col-md-4 mb-3">
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
              <div className="invalid-feedback">Please choose a username.</div>
            </div>
          </div>
        </div>
        <div className="form-row ml-3 mr-3">
          <div className="col mb-3">
            <label htmlFor="validationCustom03" className="h4">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="validationCustom03"
              placeholder="example@aol.com"
              name="email"
              value={formState.email}
              onChange={changeHandler}
              required
            />
            <div className="invalid-feedback">
              Please provide a valid email.
            </div>
          </div>
          <div className="col mb-3">
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
        <div className="d-flex justify-content-center mt-3 mb-3">
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
