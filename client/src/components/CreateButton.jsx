import React from 'react';

import PropTypes from 'prop-types';
import { PopOverFragment } from './PopOver';
import { StateLessCloseModal } from './ModalAlert';
import CreateModel from '../pages/CreateModel';
import CreateInstrument from '../pages/CreateInstrument';

export default function CreateButton({ type, setUpdate }) {
  CreateButton.propTypes = {
    type: PropTypes.string.isRequired,
    setUpdate: PropTypes.func.isRequired,
  };
  const [show, setShow] = React.useState(false);
  let title = 'Create ';
  if (type.includes('model')) {
    title += 'Model';
  } else if (type.includes('instrument')) {
    title += 'Instrument';
  }

  const handleClick = () => {
    console.log(`clicked button of type: ${type}`);
    setShow(true);
  };

  return (
    <>
      <StateLessCloseModal handleClose={() => setShow(false)} show={show} title={title} size="xl">
        {type.includes('model')
        && (
        <CreateModel onCreation={() => {
          setUpdate(true);
          setUpdate(false);
        }}
        />
        )}
        {type.includes('instrument')
        && (
        <CreateInstrument onCreation={() => {
          setUpdate(true);
          setUpdate(false);
        }}
        />
        )}
      </StateLessCloseModal>
      <button onClick={handleClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
        <PopOverFragment message={title}>
          <span className="MuiButton-label">
            <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
              <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </span>
          </span>
        </PopOverFragment>
        <span className="MuiTouchRipple-root" />
      </button>
    </>
  );
}
