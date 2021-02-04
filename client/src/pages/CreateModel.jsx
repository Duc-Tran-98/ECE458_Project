import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import Col from 'react-bootstrap/esm/Col';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';

function CreateModel() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const user = useContext(UserContext);
  if (!user.isAdmin) {
    return <ErrorPage message="You don't have the right permissions!" />;
  }
  return (
    <div className="d-flex justify-content-center mt-5">
      <Form
        className="needs-validation bg-light rounded"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="row mx-3">
          <div className="col mt-2">
            <Form.Group controlId="formModelNumber">
              <Form.Label className="h4">Model Number</Form.Label>
              <Form.Control type="text" placeholder="####" required />
              <Form.Control.Feedback type="invalid">
                Please enter a valid model number.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-2">
            <Form.Group controlId="formVendor">
              <Form.Label className="h4">Vendor</Form.Label>
              <Form.Control type="text" placeholder="Vendor" required />
              <Form.Control.Feedback type="invalid">
                Please enter a valid vendor.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-2">
            <Form.Group controlId="formCalibrationFrequency">
              <Form.Label className="h4 text-nowrap ">
                Calibration Frequency
              </Form.Label>
              <Form.Control type="number" placeholder="# Days" min={0} />
            </Form.Group>
          </div>
        </div>
        <div className="row mx-3 border-top border-dark mt-3">
          <div className="col mt-3">
            <Form.Group controlId="formDescription">
              <Form.Label className="h4">Description</Form.Label>
              <Form.Control type="text" placeholder="Description" required />
              <Form.Control.Feedback type="invalid">
                Please enter a valid description.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col mt-3">
            <Form.Group controlId="formComment">
              <Form.Label className="h4">Comment</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Sample comment"
                rows={3}
              />
            </Form.Group>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3 mb-3">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateModel;
