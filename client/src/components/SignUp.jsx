import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import CreateUser from '../queries/CreateUser';
import { GetAllUsers } from '../queries/GetUser';

import UserContext from './UserContext';
import ErrorPage from '../pages/ErrorPage';

// TODO: Add isAdmin
const schema = Yup.object({
  firstName: Yup.string().required('Please enter First Name'),
  lastName: Yup.string().required('Please enter Last Name'),
  userName: Yup.string().required('Please enter Username'),
  email: Yup.string().email().required('Please enter email'),
  password: Yup.string().required('Please enter password'),
  isAdmin: Yup.bool(),
  modelPermission: Yup.bool(),
  instrumentPermission: Yup.bool(),
  calibrationPermission: Yup.bool(),
});

const initialValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  userName: '',
  isAdmin: false,
  modelPermission: false,
  instrumentPermission: false,
  calibrationPermission: false,
};

export default function SignUp({ onCreation }) {
  SignUp.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const [allUserNames, setAllUserNames] = React.useState(['admin']);
  const user = useContext(UserContext);
  GetAllUsers({ limit: 100, offset: 0 }).then((response) => {
    if (response) {
      const parsedUsernames = response.map((element) => element.userName);
      setAllUserNames(parsedUsernames);
    }
  });

  // eslint-disable-next-line no-unused-vars
  const checkUserNameExists = (userName, setFieldError) => {
    console.log('checking if username exists');
    if (allUserNames.includes(userName)) {
      console.log('Found userName collsion! Setting error');
      setFieldError('userName', 'Username already exists');
      return true;
    }
    return false;
  };

  const handleSignup = (values, resetForm) => {
    const {
      firstName,
      lastName,
      email,
      password,
      userName,
      isAdmin,
      modelPermission,
      instrumentPermission,
      calibrationPermission,
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
      firstName,
      lastName,
      email,
      password,
      userName,
      isAdmin,
      modelPermission,
      instrumentPermission,
      calibrationPermission,
      handleResponse,
    });
  };

  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }

  return (
    <>
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
          setFieldError,
          // setErrors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
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
                        if (allUserNames.includes(e.target.value)) {
                          setFieldError('userName', 'Username already exists');
                        }
                      }
                    }}
                    isInvalid={touched.userName && (!!errors.userName || allUserNames.includes(values.userName))}
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
            </div>
            <div className="d-flex flex-row mx-auto">
              <div className="d-flex flex-column mx-auto">
                <div className="form-check form-switch mt-3">
                  <label className="form-check-label h4" htmlFor="adminCheck">
                    Admin user?
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="adminCheck"
                    name="isAdmin"
                    checked={values.isAdmin}
                    onChange={handleChange}
                  />
                  <div className="">
                    <strong>{values.isAdmin ? 'Yes' : 'No'}</strong>
                  </div>
                </div>
                <div className="form-check form-switch mt-3">
                  <label
                    className="form-check-label h4"
                    htmlFor="modelPermissionCheck"
                  >
                    Model Permissions?
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="modelPermissionCheck"
                    name="modelPermission"
                    checked={values.isAdmin || values.modelPermission}
                    onChange={handleChange}
                  />
                  <div className="">
                    <strong>{(values.isAdmin || values.modelPermission) ? 'Yes' : 'No'}</strong>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column mx-auto">
                <div className="form-check form-switch mt-3">
                  <label
                    className="form-check-label h4"
                    htmlFor="instrumentPermissionCheck"
                  >
                    Instrument Permissions?
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="instrumentPermissionCheck"
                    name="instrumentPermission"
                    checked={values.isAdmin || values.modelPermission || values.instrumentPermission}
                    onChange={handleChange}
                  />
                  <div className="">
                    <strong>
                      {(values.isAdmin || values.modelPermission || values.instrumentPermission) ? 'Yes' : 'No'}
                    </strong>
                  </div>
                </div>
                <div className="form-check form-switch mt-3">
                  <label
                    className="form-check-label h4"
                    htmlFor="calibrationPermissionCheck"
                  >
                    Calibration Permissions?
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="calibrationPermissionCheck"
                    name="calibrationPermission"
                    checked={values.isAdmin || values.calibrationPermission}
                    onChange={handleChange}
                  />
                  <div className="">
                    <strong>
                      {(values.isAdmin || values.calibrationPermission) ? 'Yes' : 'No'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center my-3">
              {isSubmitting ? (
                <CircularProgress />
              ) : (
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
