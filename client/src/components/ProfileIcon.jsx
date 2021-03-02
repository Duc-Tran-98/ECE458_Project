import React, { useContext } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import NavDropdown from 'react-bootstrap/NavDropdown';
import PropTypes from 'prop-types';
import UserContext from './UserContext';

export default function ProfileIcon({ handleSignOut }) {
  ProfileIcon.propTypes = {
    handleSignOut: PropTypes.func.isRequired,
  };

  const user = useContext(UserContext);
  const welcomeMessage = `Welcome, ${user.userName}!`;
  const fullName = `${user.firstName} ${user.lastName}`;
  const { email } = user;

  return (
    <NavDropdown title={welcomeMessage}>
      <NavDropdown.Item href="/userInfo" className="text-center">
        <PersonIcon fontSize="large" />
        <p style={{ fontSize: '24px' }}>{fullName}</p>
        <p style={{ color: 'gray' }}>{email}</p>
        <hr />
      </NavDropdown.Item>
      <NavDropdown.Item>
        <SettingsIcon />
        <p style={{ display: 'inline' }}>User Settings</p>
        <hr />
      </NavDropdown.Item>
      <NavDropdown.Item onClick={handleSignOut}>
        <ExitToAppIcon />
        <p style={{ display: 'inline' }}>Sign Out</p>
      </NavDropdown.Item>
    </NavDropdown>
  );
}
