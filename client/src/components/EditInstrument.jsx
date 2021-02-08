import { gql } from '@apollo/client';
import { print } from 'graphql';
import React, { Component } from 'react';
import InstrumentForm from './InstrumentForm';
import Query from './UseQuery';
import EditInstrumentQuery from '../queries/EditInstrument';

class EditInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/prop-types
      vendor: props.vendor,
      // eslint-disable-next-line react/prop-types
      modelNumber: props.modelNumber,
      // eslint-disable-next-line react/prop-types
      serialNumber: props.serialNumber,
      comment: '',
      id: '',
      validated: false,
      // eslint-disable-next-line react/prop-types
      viewOnly: props.viewOnly, // Is this only for viewing
    };
    // eslint-disable-next-line react/prop-types
    this.handleClose = props.handleClose;
    this.changeHandler = this.changeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    const FIND_INST = gql`
      query FindInst(
        $modelNumber: String!
        $vendor: String!
        $serialNumber: String!
      ) {
        getInstrument(
          modelNumber: $modelNumber
          vendor: $vendor
          serialNumber: $serialNumber
        ) {
          calibrationFrequency
          comment
          id
        }
      }
    `;
    const query = print(FIND_INST);
    const queryName = 'getInstrument';
    const { modelNumber, vendor, serialNumber } = this.state;
    const getVariables = () => ({ modelNumber, vendor, serialNumber });
    const handleResponse = (response) => {
      // console.log(response);
      const { comment, id } = response;
      this.setState({
        comment,
        id,
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
      const {
        comment, id, modelNumber, vendor, serialNumber,
      } = this.state;
      this.setState({ validated: true });
      console.log(comment, id);
      const handleResponse = (response) => {
        if (response.success) {
          this.handleClose(true);
        }
        // eslint-disable-next-line no-alert
        alert(response.message);
      };
      EditInstrumentQuery({
        modelNumber, vendor, serialNumber, id, comment, handleResponse,
      });
      //   const EDIT_MODEL = gql`
      //     mutation EditModel(
      //       $modelNumber: String!
      //       $vendor: String!
      //       $description: String!
      //       $comment: String
      //       $calibrationFrequency: Int
      //       $id: Int!
      //     ) {
      //       editModel(
      //         modelNumber: $modelNumber
      //         vendor: $vendor
      //         comment: $comment
      //         description: $description
      //         calibrationFrequency: $calibrationFrequency
      //         id: $id
      //       )
      //     }
      //   `;
      //   const query = print(EDIT_MODEL);
      //   const queryName = 'editModel';
      //   let { id, calibrationFrequency } = this.state;
      //   id = parseInt(id, 10);
      //   calibrationFrequency = parseInt(calibrationFrequency, 10);
      //   const {
      //     description, comment, modelNumber, vendor,
      //   } = this.state;
      //   const getVariables = () => ({
      //     description,
      //     comment,
      //     calibrationFrequency,
      //     id,
      //     modelNumber,
      //     vendor,
      //   });
      //   const handleResponse = (response) => {
      //     if (response.success) {
      //       this.handleClose(true);
      //     }
      //     // eslint-disable-next-line no-alert
      //     alert(response.message);
      //   };
      //   Query({
      //     query,
      //     queryName,
      //     getVariables,
      //     handleResponse,
      //   });
    }
  }

  onInputChange(e, v) {
    // This if for updating instrument's fields from autocomplete input
    // console.log(e, v);
    this.setState({
      modelNumber: v.modelNumber,
      vendor: v.vendor,
    });
  }

  changeHandler(e) {
    const { viewOnly } = this.state;
    // console.log(e);
    if (typeof viewOnly === 'undefined' || !viewOnly) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  render() {
    const {
      modelNumber,
      vendor,
      serialNumber,
      comment,
      validated,
      viewOnly,
    } = this.state;
    const value = { modelNumber, vendor };
    // const value = vendor.concat(' ', modelNumber);
    return (
      <div className="d-flex justify-content-center">
        <InstrumentForm
          val={value}
          modelNumber={modelNumber}
          vendor={vendor}
          comment={comment}
          serialNumber={serialNumber}
          handleSubmit={this.handleSubmit}
          changeHandler={this.changeHandler}
          validated={validated}
          onInputChange={this.onInputChange}
          viewOnly={viewOnly}
        />
      </div>
    );
  }
}

export default EditInstrument;
