import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import MouseOverPopover from './PopOver';

export default function CalibrationRow({ handleDelete, id }) {
  CalibrationRow.propTypes = {
    handleDelete: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
  };
  return (
    <div className="d-flex justify-content-center border-bottom border-dark ">
      {/* <Form
        className="needs-validation bg-light rounded"
        noValidate
        //   validated={validated}
        //   onSubmit={handleSubmit}
      > */}
      <div className="row mx-3">
        <div className="col mt-1">
          <Form.Group controlId="formUser">
            <Form.Label className="h4">User</Form.Label>
            <Form.Control
              name="user"
              type="text"
              placeholder="Unknown"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please select a user.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col mt-1">
          <Form.Group controlId="formDate">
            <Form.Label className="h4">Date</Form.Label>
            <Form.Control
              name="vendor"
              type="date"
                // placeholder="Vendor"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a date.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col mt-1">
          <Form.Group controlId="formComment">
            <Form.Label className="h4">Comment</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Sample comment"
              rows={2}
              name="comment"
              style={{ resize: 'none' }}
            />
          </Form.Group>
        </div>
        <div className="col mt-4">
          <Button variant="primary" onClick={() => handleDelete(id)}>
            <MouseOverPopover message="Delete this row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-node-minus-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                    // eslint-disable-next-line max-len
                  d="M16 8a5 5 0 0 1-9.975.5H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025A5 5 0 0 1 16 8zm-2 0a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5A.5.5 0 0 0 14 8z"
                />
              </svg>
            </MouseOverPopover>
          </Button>
        </div>
      </div>
      {/* </Form> */}
    </div>
  );
}
