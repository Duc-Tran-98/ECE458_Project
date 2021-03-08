/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import LoadBankWiz from '../components/LoadBankWiz';
import ModalAlert from '../components/ModalAlert';

export default function ComponentTest() {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <ModalAlert
        handleClose={() => setShow(false)}
        show={show}
        title="Load Bank Wizard"
      >
        {show && <LoadBankWiz />}
      </ModalAlert>
      <button type="button" className="btn" onClick={() => setShow(true)}>
        Show
      </button>
    </div>
  );
}
