import React, { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../components/UserContext';
import PasswordForm from '../components/PasswordForm';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

export default function UserInfo() {
  const user = useContext(UserContext);
  const {
    firstName, lastName,
  } = user;

  const fullName = `${firstName} ${lastName}`;

  // TODO: submit password to database
  const handleSubmitPassword = (currentPassword, newPassword) => {
    console.log(`handleSubmitPassword with current: ${currentPassword}\tnew: ${newPassword}`);
    toast.success('Successfully updated password!');
  };

  return (
    <>
      <ToastContainer />
      <h1>{`${fullName}'s Profile`}</h1>
      <PasswordForm handleSubmitPassword={handleSubmitPassword} />
    </>
  );
}
