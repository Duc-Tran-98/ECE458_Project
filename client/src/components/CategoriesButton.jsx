import React from 'react';

import PropTypes from 'prop-types';
import { PopOverFragment } from './PopOver';
import { StateLessCloseModal } from './ModalAlert';
// import ModelCategories from './ModelCategories';
import CategoryManager from './CategoryManager';

export default function CategoriesButton({ type }) {
  CategoriesButton.propTypes = {
    type: PropTypes.string.isRequired,

  };
  const [show, setShow] = React.useState(false);
  let title = '';
  if (type.includes('model')) {
    title += 'Model ';
  } else if (type.includes('instrument')) {
    title += 'Instrument ';
  }
  title += 'Categories';

  const handleClick = () => {
    console.log(`clicked button of type: ${type}`);
    setShow(true);
  };

  return (
    <>
      <StateLessCloseModal handleClose={() => setShow(false)} show={show} title={title}>
        {/* <ModelCategories /> */}
        <CategoryManager type={type} />
      </StateLessCloseModal>
      <button onClick={handleClick} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabIndex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-5057" id="mui-33928">
        <PopOverFragment message="View categories">
          <span className="MuiButton-label">
            <span className="MuiButton-startIcon MuiButton-iconSizeSmall">
              <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" />
              </svg>
            </span>
          </span>
        </PopOverFragment>
        <span className="MuiTouchRipple-root" />
      </button>
    </>
  );
}
