import React, { useState, useEffect, useContext } from 'react';
import CreateUser from '../queries/CreateUser';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import NeedsValidation from '../components/NeedsValidation';

const SignUp = () => {
  const user = useContext(UserContext);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userName: '',
    isAdmin: false,
  });
  useEffect(() => {
    NeedsValidation();
  });
  // const onChangeCheckbox = (event) => {
  //   setFormState({ ...formState, isAdmin: event.target.checked });
  // };
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
    const {
      firstName,
      lastName,
      email,
      password,
      userName,
      isAdmin,
    } = formState;
    if (validateState() && true) {
      const handleResponse = (response) => {
        // eslint-disable-next-line no-alert
        alert(response.message);
      };
      CreateUser({
        firstName, lastName, email, password, userName, isAdmin, handleResponse,
      });
    }
  };
  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <form
        className="needs-validation bg-light rounded"
        noValidate
        onSubmit={handleSignup}
      >
        <div className="row mx-3">
          <div className="col mb-3 mt-2">
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
          <div className="col mb-3 mt-2">
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
          <div className="col mb-3 mt-2">
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
        <div className="row mx-3">
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
        {/* <div className="form-check form-switch row ms-4">
          <label className="form-check-label h4 col" htmlFor="adminCheck">
            Admin user?
          </label>

          <input
            className="form-check-input mt-2"
            type="checkbox"
            id="adminCheck"
            name="isAdmin"
            onChange={onChangeCheckbox}
          />
          <div className="col">
            <strong>{formState.isAdmin ? 'Yes' : 'No'}</strong>
          </div>
        </div> */}
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
