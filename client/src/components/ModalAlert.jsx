import React from 'react';
import {
  Button,
  Modal,
  ModalTitle,
  ModalFooter,
} from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
// import Portal from '@material-ui/core/Portal';
import PropTypes from 'prop-types';
import MouseOverPopover from './PopOver';

export function StateLessModal({
  handleClose,
  show,
  title,
  children,
  width = 'modal-100w',
}) {
  // use this modal if you want to control state of show
  StateLessModal.propTypes = {
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/require-default-props
    width: PropTypes.string,
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      contentClassName="bg-theme rounded"
      // dialogClassName="d-flex justify-content-center modal-100w"
      dialogClassName={`d-flex justify-content-center ${width}`}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <ModalHeader>
        <ModalTitle id="contained-modal-title-vcenter">{title}</ModalTitle>
      </ModalHeader>
      <Modal.Body className="border-top border-dark">{children}</Modal.Body>
      <ModalFooter className="my-3">
        <Button className="btn  mx-3" onClick={handleClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function ModalAlert({ // use this modal if you're fine with modal controling its own show state
  title, children, footer, width = 'modal-100w', btnText, btnClass = 'btn', altCloseBtnId = null, popOverText = '',
}) {
  ModalAlert.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    // eslint-disable-next-line react/require-default-props
    width: PropTypes.string,
    btnText: PropTypes.string.isRequired,
    // eslint-disable-next-line react/require-default-props
    altCloseBtnId: PropTypes.string, // id of other button that you want to close modal
    // eslint-disable-next-line react/require-default-props
    btnClass: PropTypes.string,
    // eslint-disable-next-line react/require-default-props
    popOverText: PropTypes.string,
  };

  ModalAlert.defaultProps = {
    footer: null,
  };
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      if (altCloseBtnId) {
        const altBtn = document.getElementById(altCloseBtnId);
        if (altBtn) {
          altBtn.onclick = () => setShow(false);
        }
      }
    })();
    return () => { active = false; };
  }, [show]);

  return (
    <>
      {popOverText !== '' ? (
        <MouseOverPopover message={popOverText}>
          <button
            type="button"
            className={btnClass}
            onClick={() => setShow(true)}
          >
            {btnText}
          </button>
        </MouseOverPopover>
      ) : (
        <button
          type="button"
          className={btnClass}
          onClick={() => setShow(true)}
        >
          {btnText}
        </button>
      )}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        contentClassName="bg-theme rounded"
        // dialogClassName="d-flex justify-content-center modal-100w"
        dialogClassName={`d-flex justify-content-center ${width}`}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">{title}</ModalTitle>
        </ModalHeader>
        <Modal.Body className="border-top border-dark">{children}</Modal.Body>
        <ModalFooter className="my-3">
          {footer}
          <Button className="btn  mx-3" onClick={() => setShow(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default ModalAlert;
