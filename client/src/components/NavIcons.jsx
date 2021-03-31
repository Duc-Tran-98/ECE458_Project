import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import UserContext from './UserContext';

export default function NavIcons() {
  const user = useContext(UserContext);
  const approvalPermissions = true;
  const { userName } = user;
  console.log(userName);
  const notifications = 12;

  // TODO: Implement handlers for onclick events
  const handleClick = () => console.log('click');

  return (
    <>
      {approvalPermissions && (
      <IconButton
        aria-label="show 17 new notifications"
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={notifications} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      )}
      <IconButton
        aria-label="account of current user"
        onClick={handleClick}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <IconButton
        aria-label="help icon"
        onClick={handleClick}
        color="inherit"
      >
        <HelpIcon />
      </IconButton>
      <IconButton
        aria-label="signout button"
        onClick={handleClick}
        color="inherit"
      >
        <ExitToAppIcon />
      </IconButton>
    </>
  );
}
