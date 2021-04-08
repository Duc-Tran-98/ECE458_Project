import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import { MuiAddButton } from './CustomMuiIcons';

export default function CustomFormAddButton({
  createHeader, createUserPrompt, createNumericInput, createTextInput,
}) {
  CustomFormAddButton.propTypes = {
    createHeader: PropTypes.func.isRequired,
    createUserPrompt: PropTypes.func.isRequired,
    createNumericInput: PropTypes.func.isRequired,
    createTextInput: PropTypes.func.isRequired,
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // https://material-ui.com/components/menus/
  return (
    <>
      <MuiAddButton onClick={handleClick} />
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => {
          handleClose();
          createHeader();
        }}
        >
          Header
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          createUserPrompt();
        }}
        >
          User Prompt
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          createNumericInput();
        }}
        >
          Numeric Input
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          createTextInput();
        }}
        >
          Text Input
        </MenuItem>
      </Menu>
    </>
  );
}
