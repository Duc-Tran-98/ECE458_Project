import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../components/UserContext';
import PasswordForm from '../components/PasswordForm';
import ProfileInfo from '../components/ProfileInfo';
import ChangePassword from '../queries/ChangePassword';

export default function UserInfo() {
  const user = useContext(UserContext);
  const {
    firstName, lastName, userName,
  } = user;
  const netIDUser = userName.includes('@duke.edu');

  const fullName = `${firstName} ${lastName}`;

  const handleSubmitPassword = (values, resetForm) => {
    const { currentPassword, newPassword } = values;
    ChangePassword({
      userName: user.userName,
      oldPassword: currentPassword,
      newPassword,
      handleResponse: (response) => {
        if (response.success) {
          toast.success(response.message);
          resetForm();
        } else {
          toast.error(response.message);
        }
      },
    });
  };

  return (
    <>
      <h1 className="m-4">{`${fullName}'s Profile`}</h1>
      <div className="row border-bottom border-dark">
        <ProfileInfo />
      </div>
      {!netIDUser && <PasswordForm handleSubmitPassword={handleSubmitPassword} />}
    </>
  );
}
