import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

export default function PasswordForm({ handleSubmitPassword }) {
  PasswordForm.propTypes = {
    handleSubmitPassword: PropTypes.func.isRequired,
  };

  const [oldPass, setOldPass] = useState('Old Password');
  const [newPass, setNewPass] = useState('New Password');

  return (
    <>
      <h3>Current Password</h3>
      <h3>Enter New Password</h3>
      <h3>Confirm New Password</h3>
      <Button onClick={() => handleSubmitPassword(oldPass, newPass)}>Submit</Button>
    </>
  );
}
