/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { PopOverFragment } from './PopOver';

const showText = false;

export const ExportButton = ({
  onClick,
}) => (
  <button onClick={onClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
    <span className="MuiButton-label">
      <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
        <PopOverFragment message="Export all with current filters">
          <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
        </PopOverFragment>
      </span>
      {showText && 'Export'}
    </span>
    <span className="MuiTouchRipple-root" />
  </button>
);
export const ImportButton = ({
  onClick,
}) => (
  <button onClick={onClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
    <span className="MuiButton-label">
      <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
        <PopOverFragment message="Import">
          <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
          </svg>
        </PopOverFragment>
      </span>
      {showText && 'Import'}
    </span>
    <span className="MuiTouchRipple-root" />
  </button>
);
export const CreateButton = ({
  onClick,
}) => (
  <button onClick={onClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
    <span className="MuiButton-label">
      <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
        <PopOverFragment message="Create">
          <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </PopOverFragment>
      </span>
      {showText && 'Create'}
    </span>
    <span className="MuiTouchRipple-root" />
  </button>
);
export const BarcodesButton = ({
  onClick,
}) => (
  <button onClick={onClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
    <span className="MuiButton-label">
      <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
        <PopOverFragment message="Generate barcodes of selected instruments">
          <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
          </svg>
        </PopOverFragment>
      </span>
      {showText && 'Barcords'}
    </span>
    <span className="MuiTouchRipple-root" />
  </button>
);
export const CategoriesButton = ({
  onClick,
}) => (
  <button onClick={onClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
    <span className="MuiButton-label">
      <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
        <PopOverFragment message="View categories">
          <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" />
          </svg>
        </PopOverFragment>
      </span>
      {showText && 'Categories'}
    </span>
    <span className="MuiTouchRipple-root" />
  </button>
);
