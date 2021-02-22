import { gql } from '@apollo/client';
import { print } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ModelForm from './ModelForm';
import Query from './UseQuery';
import ModalAlert from './ModalAlert';

export default function EditModel({
  initVendor, initModelNumber, show, onClose,
}) {
  EditModel.propTypes = {
    show: PropTypes.bool.isRequired,
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    onClose: PropTypes.func,
  };
  EditModel.defaultProps = {
    onClose: undefined,
  };
  const [visible, setVisible] = React.useState(show); // control visibility of modal alert
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
    if (show === true) {
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
        setVisible(show);
      };
      Query({
        query,
        queryName,
        getVariables,
        handleResponse,
      });
    }
  }, [show]);

  const handleClose = (bool) => { // handle closing the modal
    setVisible(false);
    if (typeof onClose !== 'undefined') onClose(bool);
  };

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
          handleClose(true); // close after 1.5s on success
          setResponseMsg('');
        }, 1500);
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
    <ModalAlert
      handleClose={() => handleClose(false)}
      show={visible}
      title="EDIT MODEL"
      footer={
        loading ? (
          <CircularProgress /> // If waiting for response, indicate to user via spinner
        ) : (
          footElement // else, dispaly foot element
        )
      }
    >
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
    </ModalAlert>
  );
}
