import React from 'react';
import {
  Button,
  Modal,
  ModalTitle,
  ModalFooter,
} from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import PropTypes from 'prop-types';

function ModalAlert({
  handleClose, show, title, children, footer,
}) {
  ModalAlert.propTypes = {
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
  };

  ModalAlert.defaultProps = {
    footer: null,
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        contentClassName="bg-theme rounded"
        dialogClassName="d-flex justify-content-center modal-100w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">{title}</ModalTitle>
        </ModalHeader>
        <Modal.Body className="border-top border-dark">{children}</Modal.Body>
        <ModalFooter className="my-3">
          {footer}
          <Button className="btn btn-dark mx-3" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default ModalAlert;
