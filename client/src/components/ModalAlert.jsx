import React from 'react';
import {
  Button,
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import PropTypes from 'prop-types';

function ModalAlert({
  handleClose, show, title, body,
}) {
  ModalAlert.propTypes = {
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <ModalHeader closeButton>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default ModalAlert;
