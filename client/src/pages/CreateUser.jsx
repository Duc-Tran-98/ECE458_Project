import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import CreateUser from '../queries/CreateUser';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import UserForm from '../components/UserForm';

const CreateUserPage = ({ onCreation }) => {
  CreateUserPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userName: '',
    isAdmin: false,
  });
  const onChangeCheckbox = (event) => {
    setFormState({ ...formState, isAdmin: event.target.checked });
  };
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

  const onSubmit = (e) => {
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
        toast(response.message);
        if (response.success) {
          setFormState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            userName: '',
            isAdmin: false,
          });
          onCreation();
        }
      };
      CreateUser({
        firstName,
        lastName,
        email,
        password,
        userName,
        isAdmin,
        handleResponse,
      });
    }
  };
  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }

  return (
    <>
      <ToastContainer />
      <UserForm
        onSubmit={onSubmit}
        formState={formState}
        onChangeCheckbox={onChangeCheckbox}
        changeHandler={changeHandler}
      />
    </>
  );
};

export default CreateUserPage;
