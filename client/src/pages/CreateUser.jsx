import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';
import SignUp from '../components/SignUp';

const CreateUserPage = ({ onCreation }) => {
  CreateUserPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const user = useContext(UserContext);

  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }

  return (
    <>
      <SignUp onCreation={onCreation} />
    </>
  );
};

export default CreateUserPage;
