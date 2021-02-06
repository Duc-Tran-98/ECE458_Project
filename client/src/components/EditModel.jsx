import { gql } from '@apollo/client';
import { print } from 'graphql';
import React, { Component } from 'react';
import ModelForm from './ModelForm';
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
      validated: false,
      // eslint-disable-next-line react/prop-types
      viewOnly: props.viewOnly, // Is this only for viewing
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
        description, comment, id,
      } = response;
      let { calibrationFrequency } = response;
      calibrationFrequency = calibrationFrequency.toString();
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
    const { viewOnly } = this.state;
    if (typeof viewOnly === 'undefined' || !viewOnly) {
      e.preventDefault();
      this.setState({ validated: true });
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
      let { id, calibrationFrequency } = this.state;
      id = parseInt(id, 10);
      calibrationFrequency = parseInt(calibrationFrequency, 10);
      const {
        description, comment, modelNumber, vendor,
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
        // eslint-disable-next-line no-alert
        alert(response.message);
      };
      Query({
        query, queryName, getVariables, handleResponse,
      });
    }
  }

  changeHandler(e) {
    const { viewOnly } = this.state;
    if (typeof viewOnly === 'undefined' || !viewOnly) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  render() {
    const {
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
      validated,
      viewOnly,
    } = this.state;
    return (
      <div className="d-flex justify-content-center">
        <ModelForm
          modelNumber={modelNumber}
          vendor={vendor}
          description={description}
          comment={comment}
          calibrationFrequency={calibrationFrequency}
          handleSubmit={this.handleSubmit}
          changeHandler={this.changeHandler}
          validated={validated}
          viewOnly={viewOnly}
        />
      </div>
    );
  }
}

export default EditModel;
