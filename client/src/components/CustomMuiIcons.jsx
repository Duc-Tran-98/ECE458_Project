/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TitleIcon from '@material-ui/icons/Title';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { PopOverFragment } from './PopOver';

const showText = false;
const buttonClass = 'MuiButtonBase-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall';
const spanClass = 'MuiButton-startIcon MuiButton-iconSizeXLarge';
const viewBox = '0 0 16 16';

const SimpleMuiButton = ({ onClick, title, path }) => (
  <button onClick={onClick} className={buttonClass} tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
    <PopOverFragment message={title}>
      <span className="MuiButton-label">
        <span className={spanClass}>
          <SvgIcon className="MuiSvgIcon-root" focusable="false" viewBox={viewBox} aria-hidden="true">
            {path}
          </SvgIcon>
        </span>
        {showText && 'Export'}
      </span>
    </PopOverFragment>
    <span className="MuiTouchRipple-root" />
  </button>
);

export const ExportButton = ({
  onClick,
}) => (
  <SimpleMuiButton
    onClick={onClick}
    title="Export all with current filters"
    path={(
      <>
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
      </>
  )}
  />
);

export const ImportButton = ({
  onClick,
}) => (
  <SimpleMuiButton
    onClick={onClick}
    title="Import"
    path={(
      <>
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
      </>
  )}
  />
);
export const MuiCreateButton = ({
  handleClick, title,
}) => (
  <SimpleMuiButton
    onClick={handleClick}
    title={title}
    path={(
      <>
        {/* <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /> */}
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
      </>
  )}
  />
);
export const BarcodesButton = ({
  onClick,
}) => (
  <SimpleMuiButton
    onClick={onClick}
    title="Generate barcodes of selected instruments"
    path={(
      <>
        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
      </>
  )}
  />
);
export const MuiCategoriesButton = ({
  onClick,
}) => (
  <SimpleMuiButton
    onClick={onClick}
    title="View categories"
    path={(
      <>
        <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" />
      </>
  )}
  />
);

export const MuiDeleteButton = ({ onClick, user }) => {
  let color = '#fc2311';
  if (window.location.href.includes('Model') && !(user.isAdmin || user.modelPermission)) {
    color = '#665c5b';
  }
  if (window.location.href.includes('Instrument') && !(user.isAdmin || user.instrumentPermission)) {
    color = '#665c5b';
  }
  return (
    <IconButton onClick={onClick}>
      <DeleteIcon style={{ color }} />
    </IconButton>
  );
};

export const MuiAddButton = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <AddIcon />
  </IconButton>
);

export const AddPopOver = ({ onClick, message }) => (
  <PopOverFragment message={message}>
    <IconButton onClick={onClick}>
      <AddIcon />
    </IconButton>
  </PopOverFragment>
);

export const DeletePopOver = ({ title, onClick }) => (
  <PopOverFragment message={title}>
    <MuiDeleteButton onClick={onClick} />
  </PopOverFragment>
);

export const MoveUpPopOver = ({ title, onClick }) => (
  <PopOverFragment message={title}>
    <IconButton onClick={onClick}>
      <ExpandLessIcon />
    </IconButton>
  </PopOverFragment>
);

export const MoveDownPopOver = ({ title, onClick }) => (
  <PopOverFragment message={title}>
    <IconButton onClick={onClick}>
      <ExpandMoreIcon />
    </IconButton>
  </PopOverFragment>
);

export const CustomFormDeletePopOver = ({ title, onClick }) => (
  <PopOverFragment message={title}>
    <IconButton onClick={onClick}>
      <DeleteIcon style={{ color: '#fc2311' }} />
    </IconButton>
  </PopOverFragment>
);

export const MuiEditButton = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <EditIcon />
  </IconButton>
);

// eslint-disable-next-line no-unused-vars
export const MuiSaveButton = ({ onClick, color }) => (
  <IconButton onClick={onClick}>
    <SaveIcon color={color} />
  </IconButton>
);

export const PreviewButton = ({ message, onClick }) => (
  <PopOverFragment message={message}>
    <IconButton onClick={onClick}>
      <VisibilityIcon />
    </IconButton>
  </PopOverFragment>
);

export const EditPopoverIcon = ({ message, onClick }) => (
  <PopOverFragment message={message}>
    <IconButton onClick={onClick}>
      <EditIcon />
    </IconButton>
  </PopOverFragment>
);

export const TitlePopoverIcon = ({ message, onClick }) => (
  <PopOverFragment message={message}>
    <IconButton onClick={onClick}>
      <TitleIcon />
    </IconButton>
  </PopOverFragment>
);

export const TextFieldPopoverIcon = ({ message, onClick }) => (
  <PopOverFragment message={message}>
    <IconButton onClick={onClick}>
      <TextFieldsIcon />
    </IconButton>
  </PopOverFragment>
);

export const NumberInputPopoverIcon = ({ message, onClick }) => (
  <PopOverFragment message={message}>
    <IconButton onClick={onClick}>
      <FormatListNumberedIcon />
    </IconButton>
  </PopOverFragment>
);
