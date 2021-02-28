import { gql } from '@apollo/client';
import { print } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import ModelForm from './ModelForm';
import Query from './UseQuery';
import UserContext from './UserContext';

export default function EditModel({ initVendor, initModelNumber, handleDelete }) {
  EditModel.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    handleDelete: PropTypes.func,
  };
  EditModel.defaultProps = {
    handleDelete: null,
  };
  const user = React.useContext(UserContext);
  const history = useHistory();
  const [model, setModel] = React.useState({
    // set model state
    modelNumber: initModelNumber,
    vendor: initVendor,
    description: '',
    id: '',
    comment: '',
    calibrationFrequency: '',
  });
  const [loading, setLoading] = React.useState(false); // if we are waiting for response
  const [responseMsg, setResponseMsg] = React.useState(''); // msg response

  React.useEffect(() => {
    let active = true;
    (() => {
      if (active) {
        Query({
          query: print(gql`
            query FindModel($modelNumber: String!, $vendor: String!) {
              getModel(modelNumber: $modelNumber, vendor: $vendor) {
                id
                description
                comment
                calibrationFrequency
              }
            }
          `),
          queryName: 'getModel',
          getVariables: () => ({
            modelNumber: initModelNumber,
            vendor: initVendor,
          }),
          handleResponse: (response) => {
            const { description, comment, id } = response;
            let { calibrationFrequency } = response;
            if (calibrationFrequency !== null) {
              calibrationFrequency = calibrationFrequency.toString();
            } else {
              calibrationFrequency = 0;
            }
            setModel({
              ...model,
              description,
              comment,
              id,
              calibrationFrequency,
              modelNumber: initModelNumber,
              vendor: initVendor,
            });
          },
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [initModelNumber, initVendor]);

  const onInputChange = (e, v) => {
    // handle input change from async suggest
    if (v.inputValue) {
      // If use inputs a new value
      setModel({ ...model, vendor: v.inputValue });
    } else {
      // Else they picked an existing option
      setModel({ ...model, vendor: v.vendor });
    }
  };

  const changeHandler = (e) => {
    // handle other input
    setModel({ ...model, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    // handle submitting the data; no validation ATM
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
        const { state } = history.location;
        history.replace(
          `/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}&description=${description}`,
          state,
        ); // change url because link for view instruments have changed;
      }
      setTimeout(() => {
        setResponseMsg('');
      }, 1000);
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
  let footElement = null;
  if (user.isAdmin) {
    footElement = responseMsg.length > 0 ? (
      <div className="row">
        <div className="col">
          <button type="button" className="btn ">
            Delete Model
          </button>
        </div>
        <div className="col">
          <button type="button" className="btn  text-nowrap">
            {responseMsg}
          </button>
        </div>
      </div>
    ) : (
      <div className="row">
        <div className="col">
          <button type="button" className="btn " onClick={handleDelete}>
            Delete Model
          </button>
        </div>
        <div className="col">
          <button type="button" className="btn  text-nowrap" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    ); // foot element controls when to display Save Changes buttion or response msg
  }

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
        viewOnly={!user.isAdmin}
        onInputChange={onInputChange}
      />
      <div className="d-flex justify-content-center my-3">
        <div className="">{loading ? <CircularProgress /> : footElement}</div>
      </div>
    </>
  );
}
