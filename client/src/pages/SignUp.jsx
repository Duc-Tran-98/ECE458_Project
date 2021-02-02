import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { print } from "graphql";
import axios from "axios";
const route = process.env.NODE_ENV.includes("dev")
  ? "http://localhost:4000"
  : "/api";
const SignUp = (props) => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userName: "",
    isAdmin: false,
  });
  useEffect(() => {
    const forms = document.getElementsByClassName("needs-validation");
    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  });
  const onChangeCheckbox = (event) => {
    setFormState({ ...formState, isAdmin: event.target.checked });
  };
  const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
      $email: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $userName: String!
      $isAdmin: Boolean!
    ) {
      signup(
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        userName: $userName
        isAdmin: $isAdmin
      )
    }
  `;

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateState() && true) {
      axios
        .post(route, {
          query: print(SIGNUP_MUTATION),
          variables: {
            firstName: formState.firstName,
            email: formState.email,
            password: formState.password,
            lastName: formState.lastName,
            userName: formState.userName,
            isAdmin: formState.isAdmin,
          },
        })
        .then((res) => {
          //console.log(res);
          const response = JSON.parse(res.data.data.signup);
          // console.log(response);
          if (response.success) {
            alert(response.message);
            window.location.href = "/";
          } else {
            alert("That username/email is already taken");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const validateState = () => {
    var { firstName, lastName, email, password } = formState;
    return (
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      password.length > 0
    );
  };
  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

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
        <div className="form-check form-switch row ms-4">
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
            <strong>{formState.isAdmin ? "Yes" : "No"}</strong>
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
