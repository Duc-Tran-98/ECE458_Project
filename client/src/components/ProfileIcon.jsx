import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
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

  const history = useHistory();
  const user = useContext(UserContext);
  const welcomeMessage = `Welcome, ${user.userName}!`;
  const fullName = `${user.firstName} ${user.lastName}`;
  const { email } = user;

  const handleClick = () => {
    history.push('/userInfo');
  };

  return (
    <NavDropdown title={welcomeMessage} className="h5">
      <div className="shadow-sm p-3 rounded">
        <NavDropdown.Item onClick={handleClick} className="text-center border-bottom border-dark">
          <PersonIcon fontSize="large" />
          <p style={{ fontSize: '24px' }}>{fullName}</p>
          <p style={{ color: 'gray' }}>{email}</p>
        </NavDropdown.Item>
        <NavDropdown.Item onClick={handleClick} className="text-center border-bottom border-dark" style={{ margin: '20px 0px' }}>
          <SettingsIcon />
          <p style={{ display: 'inline' }}>User Settings</p>
        </NavDropdown.Item>
        <NavDropdown.Item onClick={handleSignOut} className="text-center" style={{ margin: '10px 0px' }}>
          <ExitToAppIcon />
          <p style={{ display: 'inline' }}>Sign Out</p>
        </NavDropdown.Item>
      </div>
    </NavDropdown>
  );
}
