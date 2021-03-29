import React from 'react';

import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { PopOverFragment } from './PopOver';
import { StateLessCloseModal } from './ModalAlert';
// import ModelCategories from './ModelCategories';
import CategoryManager from './CategoryManager';
import { MuiCategoriesButton } from './CustomMuiIcons';

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
      <MuiCategoriesButton onClick={handleClick} />
    </>
  );
}
