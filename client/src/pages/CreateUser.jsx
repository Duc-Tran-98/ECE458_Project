import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import CreateUser from '../queries/CreateUser';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import SignUp from '../components/SignUp';

const CreateUserPage = ({ onCreation }) => {
  CreateUserPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);

  const handleCreateUser = (values, resetForm) => {
    const {
      firstName,
      lastName,
      email,
      password,
      userName,
      isAdmin,
    } = values;
    const handleResponse = (response) => {
      // eslint-disable-next-line no-alert
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
      handleResponse,
    });
  };
  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }

  return (
    <>
      <ToastContainer />
      <SignUp handleSubmit={handleCreateUser} />
    </>
  );
};

export default CreateUserPage;
