/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import UserContext from './UserContext';

const BasicLabel = ({
  className, label, formName, value,
}) => (
  <Form.Group>
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
    firstName, lastName, userName,
  } = user;
  //   const {
  //     firstName, lastName, isAdmin, email, userName,
  //   } = user;
  return (
    <div className="m-4">
      <h2>Profile Information</h2>
      <Form.Row>
        <Col>
          <BasicLabel className="p" label="First Name" formName="firstName" value={firstName} />
        </Col>
        <Col>
          <BasicLabel className="p" label="Last Name" formName="lastName" value={lastName} />
        </Col>
        <Col>
          <BasicLabel className="p" label="User Name" formName="userName" value={userName} />
        </Col>
      </Form.Row>
    </div>
  );
}
