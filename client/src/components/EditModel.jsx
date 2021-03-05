import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import ModelForm from './ModelForm';
import UserContext from './UserContext';
import FindModel from '../queries/FindModel';
import EditModelQuery from '../queries/EditModel';

export default function EditModel({ initVendor, initModelNumber, handleDelete }) {
  EditModel.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    handleDelete: PropTypes.func,
  };
  EditModel.defaultProps = {
    handleDelete: null,
  };
  const user = useContext(UserContext);
  const history = useHistory();
  const [model, setModel] = useState({
    // set model state
    modelNumber: initModelNumber,
    vendor: initVendor,
    description: '',
    id: '',
    comment: '',
    calibrationFrequency: '',
    categories: [],
  });
  const [loading, setLoading] = useState(false); // if we are waiting for response
  const [responseMsg, setResponseMsg] = useState(''); // msg response

  const handleFindModel = (response) => {
    console.log('EditModel with response: ');
    console.log(response);
    const categories = response.categories.map((item) => item.name);
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
      categories,
      calibrationFrequency,
      modelNumber: initModelNumber,
      vendor: initVendor,
    });
  };

  useEffect(() => {
    FindModel({ modelNumber: initModelNumber, vendor: initVendor, handleResponse: handleFindModel });
  }, []); // empty dependency array, only run once on mount

  const updateHistory = (modelNumber, vendor, description) => {
    const { state } = history.location;
    history.replace(
      `/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}&description=${description}`,
      state,
    ); // change url because link for view instruments have changed;
  };

  const handleSubmit = (e) => {
    // handle submitting the data; no validation ATM
    e.preventDefault();
    setLoading(true);

    // Parse information from model information (TODO: Refactor to from formik values)
    let { id, calibrationFrequency } = model;
    id = parseInt(id, 10);
    calibrationFrequency = parseInt(calibrationFrequency, 10);
    const {
      description, comment, modelNumber, vendor, categories,
    } = model;

    // Send actual query to edit model
    EditModelQuery({
      id,
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
      categories,
      handleResponse: (response) => {
        setLoading(false);
        setResponseMsg(response.message);
        if (response.success) {
          updateHistory(modelNumber, vendor, description);
        }
        setTimeout(() => {
          setResponseMsg('');
        }, 1000);
      },
    });
  };

  const {
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
    categories,
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
        categories={categories}
        calibrationFrequency={calibrationFrequency}
        handleFormSubmit={handleSubmit}
        validated={false}
        diffSubmit
        viewOnly={!user.isAdmin}
      />
      <div className="d-flex justify-content-center my-3">
        <div className="">{loading ? <CircularProgress /> : footElement}</div>
      </div>
    </>
  );
}
