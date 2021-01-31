import React from "react";
import {
  Button,
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

function ModalAlert(props) {
  const handleClose = () => props.handleClose();

  return (
    <React.Fragment>
      <Modal show={props.show} onHide={handleClose} animation={false}>
        <ModalHeader closeButton>
          <ModalTitle>{props.title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{props.body}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}
export default ModalAlert;
