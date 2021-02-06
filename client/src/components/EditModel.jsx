import { gql } from '@apollo/client';
import { print } from 'graphql';
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Query from './UseQuery';

class EditModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/prop-types
      vendor: props.vendor,
      // eslint-disable-next-line react/prop-types
      modelNumber: props.modelNumber,
      description: '',
      comment: '',
      calibrationFrequency: '',
      id: '',
    };
    // eslint-disable-next-line react/prop-types
    this.handleClose = props.handleClose;
    this.changeHandler = this.changeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const FIND_MODEL = gql`
          query FindModel($modelNumber: String!, $vendor: String!) {
            getModel(modelNumber: $modelNumber, vendor: $vendor) {
              id
              description
              comment
              calibrationFrequency
            }
          }
        `;
    const query = print(FIND_MODEL);
    const queryName = 'getModel';
    const { modelNumber, vendor } = this.state;
    const getVariables = () => ({ modelNumber, vendor });
    const handleResponse = (response) => {
      // console.log(response);
      const {
        description, comment, calibrationFrequency, id,
      } = response;
      this.setState({
        description, comment, calibrationFrequency, id,
      });
    };
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleSubmit(e) {
    e.preventDefault();
    const EDIT_MODEL = gql`
      mutation EditModel(
        $modelNumber: String!
        $vendor: String!
        $description: String!
        $comment: String
        $calibrationFrequency: Int
        $id: Int!
      ) {
        editModel(modelNumber: $modelNumber, vendor: $vendor, comment: $comment, description: $description, calibrationFrequency: $calibrationFrequency, id: $id)
      }
    `;
    const query = print(EDIT_MODEL);
    const queryName = 'editModel';
    let { id } = this.state;
    id = parseInt(id, 10);
    const {
      description, comment, calibrationFrequency, modelNumber, vendor,
    } = this.state;
    const getVariables = () => ({
      description,
      comment,
      calibrationFrequency,
      id,
      modelNumber,
      vendor,
    });
    const handleResponse = (response) => {
      if (response.success) {
        this.handleClose(true);
      }
      alert(response.message);
    };
    Query({
      query, queryName, getVariables, handleResponse,
    });
  }

  changeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
    } = this.state;
    return (
      <div className="d-flex justify-content-center">
        <Form className="bg-light rounded" onSubmit={this.handleSubmit}>
          <div className="row mx-3">
            <div className="col mt-1">
              <Form.Group controlId="formModelNumber">
                <Form.Label className="h4">Model Number</Form.Label>
                <Form.Control
                  name="modelNumber"
                  type="text"
                  value={modelNumber}
                  onChange={this.changeHandler}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid model number.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col mt-1">
              <Form.Group controlId="formVendor">
                <Form.Label className="h4">Vendor</Form.Label>
                <Form.Control
                  name="vendor"
                  type="text"
                  value={vendor}
                  onChange={this.changeHandler}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid vendor.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col mt-1">
              <Form.Group controlId="formCalibrationFrequency">
                <Form.Label className="h4 text-nowrap ">
                  Calibration Frequency
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  name="calibrationFrequency"
                  value={calibrationFrequency}
                  onChange={this.changeHandler}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mx-3 border-top border-dark mt-3">
            <div className="col mt-3">
              <Form.Group controlId="formDescription">
                <Form.Label className="h4">Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={description}
                  onChange={this.changeHandler}
                />
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
                  rows={3}
                  name="comment"
                  value={comment}
                  onChange={this.changeHandler}
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
}

export default EditModel;
