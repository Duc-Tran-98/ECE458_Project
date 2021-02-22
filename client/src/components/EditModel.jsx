import { gql } from '@apollo/client';
import { print } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ModelForm from './ModelForm';
import Query from './UseQuery';

export default function EditModel({
  initVendor, initModelNumber,
}) {
  EditModel.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
  };
  const [model, setModel] = React.useState({ // set model state
    modelNumber: initModelNumber,
    vendor: initVendor,
    description: '',
    id: '',
    comment: '',
    calibrationFrequency: '',
  });
  const [loading, setLoading] = React.useState(false); // if we are waiting for response
  const [responseMsg, setResponseMsg] = React.useState(''); // msg response

  React.useEffect(() => { // This is called when the prop show changes value
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
    const getVariables = () => ({
      modelNumber: initModelNumber,
      vendor: initVendor,
    });
    const handleResponse = (response) => {
      const { description, comment, id } = response;
      let { calibrationFrequency } = response;
      calibrationFrequency = calibrationFrequency.toString();
      setModel({
        ...model,
        description,
        comment,
        id,
        calibrationFrequency,
        modelNumber: initModelNumber,
        vendor: initVendor,
      });
    };
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  }, [initModelNumber, initVendor]);

  const onInputChange = (e, v) => { // handle input change from async suggest
    if (v.inputValue) {
      // If use inputs a new value
      setModel({ ...model, vendor: v.inputValue });
    } else {
      // Else they picked an existing option
      setModel({ ...model, vendor: v.vendor });
    }
  };

  const changeHandler = (e) => { // handle other input
    setModel({ ...model, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => { // handle submitting the data; no validation ATM
    e.preventDefault();
    setLoading(true);
    const EDIT_MODEL = gql`
        mutation EditModel(
          $modelNumber: String!
          $vendor: String!
          $description: String!
          $comment: String
          $calibrationFrequency: Int
          $id: Int!
        ) {
          editModel(
            modelNumber: $modelNumber
            vendor: $vendor
            comment: $comment
            description: $description
            calibrationFrequency: $calibrationFrequency
            id: $id
          )
        }
      `;
    const query = print(EDIT_MODEL);
    const queryName = 'editModel';
    let { id, calibrationFrequency } = model;
    id = parseInt(id, 10);
    calibrationFrequency = parseInt(calibrationFrequency, 10);
    const {
      description, comment, modelNumber, vendor,
    } = model;
    const getVariables = () => ({
      description,
      comment,
      calibrationFrequency,
      id,
      modelNumber,
      vendor,
    });
    const handleResponse = (response) => {
      setLoading(false);
      setResponseMsg(response.message);
      if (response.success) {
        setTimeout(() => {
          setResponseMsg('');
        }, 1000);
      }
    };
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  };

  const {
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
  } = model;
  // eslint-disable-next-line no-unused-vars
  const footElement = responseMsg.length > 0 ? (
    <button type="button" className="btn btn-dark">
      {responseMsg}
    </button>
  ) : (
    <button type="button" className="btn btn-dark" onClick={handleSubmit}>
      Save Changes
    </button>
  ); // foot element controls when to display Save Changes buttion or response msg
  return (
    <>
      <ModelForm
        modelNumber={modelNumber}
        vendor={vendor}
        description={description}
        comment={comment}
        calibrationFrequency={calibrationFrequency}
        handleSubmit={handleSubmit}
        changeHandler={changeHandler}
        validated={false}
        diffSubmit
        onInputChange={onInputChange}
      />
      <div className="d-flex justify-content-center my-3">
        <div className="">{loading ? (<CircularProgress />) : (footElement)}</div>
      </div>
    </>
  );
}

/*
loading ? (
          <CircularProgress /> // If waiting for response, indicate to user via spinner
        ) : (
          footElement // else, dispaly foot element
        )
*/
