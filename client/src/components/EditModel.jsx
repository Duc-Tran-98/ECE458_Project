import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
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

  const [modelId, setModelId] = useState(0);
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
  const [completeFetch, setCompleteFetch] = useState(false); // wait to render ModelForm until all fields ready

  const handleFindModel = (response) => {
    console.log('EditModel with response: ');
    console.log(response);
    const categories = response.categories.map((item) => item.name);
    const { description, comment, id } = response;
    setModelId(parseInt(id, 10));
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
    setCompleteFetch(true);
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

  const handleSubmit = (values) => {
    console.log('Handling EditModel submit with values: ');
    console.log(values);
    console.log(`modelId: ${modelId}`);

    // Parse information from model information
    const {
      calibrationFrequency, description, comment, modelNumber, vendor, categories,
    } = values;

    // Send actual query to edit model
    EditModelQuery({
      id: modelId,
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency: parseInt(calibrationFrequency, 10),
      categories,
      handleResponse: (response) => {
        console.log('Completed edit model query with response: ');
        console.log(response);
        if (response.success) {
          updateHistory(modelNumber, vendor, description);
        }
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

  return (
    <>
      {completeFetch
      && (
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
        handleDelete={handleDelete}
        type="edit"
      />
      )}
    </>
  );
}
