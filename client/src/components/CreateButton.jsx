import React from 'react';

import PropTypes from 'prop-types';
import { StateLessCloseModal } from './ModalAlert';
import CreateModel from '../pages/CreateModel';
import CreateInstrument from '../pages/CreateInstrument';
import { MuiCreateButton } from './CustomMuiIcons';

export default function CreateButton({ type, onCreate }) {
  CreateButton.propTypes = {
    type: PropTypes.string.isRequired,
    onCreate: PropTypes.func.isRequired,
  };
  const [show, setShow] = React.useState(false);
  let title = 'Create ';
  if (type.includes('model')) {
    title += 'Model';
  } else if (type.includes('instrument')) {
    title += 'Instrument';
  }

  const handleClick = () => {
    setShow(true);
  };

  return (
    <>
      <StateLessCloseModal handleClose={() => setShow(false)} show={show} title={title} size="xl">
        {type.includes('model')
        && (
        <CreateModel onCreation={() => {
          onCreate();
        }}
        />
        )}
        {type.includes('instrument')
        && (
        <CreateInstrument onCreation={() => {
          onCreate();
        }}
        />
        )}
      </StateLessCloseModal>
      <MuiCreateButton handleClick={handleClick} title={title} />
    </>
  );
}
