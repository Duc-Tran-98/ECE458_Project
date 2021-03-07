import React, { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../components/UserContext';
import PasswordForm from '../components/PasswordForm';
import ChangePassword from '../queries/ChangePassword';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

export default function UserInfo() {
  const user = useContext(UserContext);
  const {
    firstName, lastName,
  } = user;
  console.log(user);

  const fullName = `${firstName} ${lastName}`;

  const handleSubmitPassword = (values, resetForm) => {
    const { currentPassword, newPassword } = values;
    console.log(`handleSubmitPassword with current: ${currentPassword}\tnew: ${newPassword}`);
    ChangePassword({
      userName: user.userName,
      oldPassword: currentPassword,
      newPassword,
      handleResponse: (response) => {
        if (response.success) {
          toast.success(response.message);
          resetForm();
        } else {
          console.log(response);
          toast.error(response.message);
        }
      },
    });
  };

  return (
    <>
      <ToastContainer />
      <h1 className="m-4">{`${fullName}'s Profile`}</h1>
      <PasswordForm handleSubmitPassword={handleSubmitPassword} />
    </>
  );
}
