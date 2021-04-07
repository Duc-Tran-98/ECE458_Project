import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import PropTypes from 'prop-types';
import UserContext from './UserContext';

export default function NavIcons({ handleSignOut }) {
  NavIcons.propTypes = {
    handleSignOut: PropTypes.func.isRequired,
  };
  const history = useHistory();
  const user = useContext(UserContext);
  const approvalPermissions = user.calibrationApproverPermission;
  // const { userName } = user;
  // console.log(userName);
  const notifications = 12;

  // TODO: Implement handlers for onclick events
  const handleClick = () => history.push('/viewCalibrationArppovals?page=1&limit=25');

  return (
    <>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">

        {approvalPermissions && (
          <li className="nav-item">
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleClick}
            >
              <Badge badgeContent={notifications} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </li>
        )}
        <li className="nav-item">
          <IconButton
            aria-label="account of current user"
            onClick={() => history.push('/userInfo')}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </li>
        <li className="nav-item">
          <IconButton
            aria-label="help icon"
            onClick={() => history.push('/help')}
            color="inherit"
          >
            <HelpIcon />
          </IconButton>
        </li>
        <li className="nav-item">
          <IconButton
            aria-label="signout button"
            onClick={handleSignOut}
            color="inherit"
          >
            <ExitToAppIcon />
          </IconButton>
        </li>
      </ul>
    </>
  );
}
