import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import CreateUser from '../queries/CreateUser';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

import UserContext from './UserContext';
import ErrorPage from '../pages/ErrorPage';

// TODO: Add isAdmin
const schema = Yup.object({
  firstName: Yup.string()
    .required('Please enter First Name'),
  lastName: Yup.string()
    .required('Please enter Last Name'),
  userName: Yup.string()
    .required('Please enter Username'),
  email: Yup.string().email()
    .required('Please enter email'),
  password: Yup.string()
    .required('Please enter password'),
  isAdmin: Yup.bool(),
});

const initialValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  userName: '',
  isAdmin: false,
};

export default function SignUp({ onCreation }) {
  SignUp.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);

  const handleSignup = (values, resetForm) => {
    const {
      firstName,
      lastName,
      email,
      password,
      userName,
      isAdmin,
    } = values;
    const handleResponse = (response) => {
      if (response.success) {
        toast.success(response.message);
        resetForm();
        onCreation();
      } else {
        toast.error(response.message);
      }
    };
    CreateUser({
      firstName, lastName, email, password, userName, isAdmin, handleResponse,
    });
  };

  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          setTimeout(() => {
            handleSignup(values, resetForm);
            setSubmitting(false);
          }, 500);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          errors,
          values,
          touched,
          isSubmitting,
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="row mx-3" style={{ marginBottom: '20px' }}>
              <Form.Group controlId="firstName" className="col mt-3">
                <Form.Label className="h4">First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={values.firstName}
                  placeholder="First Name"
                  onChange={handleChange}
                  isInvalid={touched.firstName && !!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="lastName" className="col mt-3">
                <Form.Label className="h4">Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={values.lastName}
                  placeholder="Last Name"
                  onChange={handleChange}
                  isInvalid={touched.lastName && !!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
              {/* TODO: Add validation based on username exists */}
              <Form.Group controlId="userName" className="col mt-3">
                <Form.Label className="h4">Username</Form.Label>
                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name="userName"
                    value={values.userName}
                    placeholder="Username"
                    onChange={(e) => {
                      if (!e.target.value.includes('@')) {
                        handleChange(e);
                      }
                    }}
                    isInvalid={touched.userName && !!errors.userName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userName}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>
            <div className="row mx-3 border-top border-dark">
              <Form.Group controlId="email" className="col mt-3">
                <Form.Label className="h4">Email</Form.Label>
                <Form.Control
                  name="email"
                  value={values.email}
                  placeholder="example@duke.edu"
                  onChange={handleChange}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              {/* TODO: Add password confirmation */}
              <Form.Group controlId="password" className="col mt-3">
                <Form.Label className="h4">Password</Form.Label>
                <Form.Control
                  name="password"
                  value={values.password}
                  type="password"
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="form-check form-switch mt-4 col">
                <label className="form-check-label h4 col" htmlFor="adminCheck">
                  Admin user?
                </label>

                <input
                  className="form-check-input mt-2"
                  type="checkbox"
                  id="adminCheck"
                  name="isAdmin"
                  value={values.isAdmin}
                  onChange={handleChange}
                />
                <div className="col">
                  <strong>{values.isAdmin ? 'Yes' : 'No'}</strong>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center my-3">
              {isSubmitting ? <CircularProgress />
                : (
                  <button className="btn btn-dark" type="submit">
                    Register
                  </button>
                )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
