/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import UserContext from './UserContext';

const BasicLabel = ({
  groupClass, className, label, formName, value,
}) => (
  <Form.Group className={groupClass}>
    <Form.Label className={className}>{label}</Form.Label>
    <Form.Control
      type="text"
      name={formName}
      value={value}
      disabled
    />
  </Form.Group>
);

export default function ProfileInfo() {
  const user = useContext(UserContext);
  const {
    firstName, lastName, userName, email,
  } = user;
  return (
    <div className="m-4">
      <h2>Profile Information</h2>
      <div className="row mx-3">
        <BasicLabel groupClass="col mt-3" className="p" label="First Name" formName="firstName" value={firstName} />
        <BasicLabel groupClass="col mt-3" className="p" label="Last Name" formName="lastName" value={lastName} />
      </div>
      <div className="row mx-3">
        <BasicLabel groupClass="col mt-3" className="p" label="User Name" formName="userName" value={userName} />
        <BasicLabel groupClass="col mt-3" className="p" label="eMail" formName="eMail" value={email} />
      </div>
    </div>
  );
}
