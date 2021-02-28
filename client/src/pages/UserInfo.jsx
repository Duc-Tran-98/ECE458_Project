import React, { useContext } from 'react';
import UserContext from '../components/UserContext';
import PasswordForm from '../components/PasswordForm';

export default function UserInfo() {
  const user = useContext(UserContext);
  const {
    firstName, lastName,
  } = user;

  const fullName = `${firstName} ${lastName}`;

  const handleSubmitPassword = (oldPassword, newPassword) => {
    console.log(`oldPassword: ${oldPassword}`);
    console.log(`newPassword: ${newPassword}`);
  };

  return (
    <>
      <h1>{`${fullName}'s Profile`}</h1>
      <PasswordForm handleSubmitPassword={handleSubmitPassword} />
    </>
  );
}
