import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModelForm from './ModelForm';
import UserContext from './UserContext';
import FindModel from '../queries/FindModel';
import EditModelQuery from '../queries/EditModel';

export default function EditModel({ initVendor, initModelNumber, deleteBtn }) {
  EditModel.propTypes = {
    initModelNumber: PropTypes.string.isRequired,
    initVendor: PropTypes.string.isRequired,
    deleteBtn: PropTypes.node.isRequired,
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
    supportLoadBankCalibration: false,
    supportKlufeCalibration: false,
    categories: [],
  });
  const [completeFetch, setCompleteFetch] = useState(false); // wait to render ModelForm until all fields ready

  const handleFindModel = (response) => {
    const categories = response.categories.map((item) => item.name);
    const {
      description, comment, id, supportLoadBankCalibration, supportKlufeCalibration,
    } = response;
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
      supportLoadBankCalibration,
      supportKlufeCalibration,
      modelNumber: initModelNumber,
      vendor: initVendor,
    });
    setCompleteFetch(true);
  };

  useEffect(() => {
    FindModel({ modelNumber: initModelNumber, vendor: initVendor, handleResponse: handleFindModel });
  }, []); // empty dependency array, only run once on mount

  const updateHistory = (modelNumber, vendor) => {
    const { state } = history.location;
    history.replace(
      `/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}`,
      state,
    ); // change url because link for view instruments have changed;
  };

  const handleSubmit = (values) => {
    // Parse information from model information
    const {
      calibrationFrequency, supportLoadBankCalibration, supportKlufeCalibration, description, comment, modelNumber, vendor, categories,
    } = values;

    // Send actual query to edit model
    EditModelQuery({
      id: modelId,
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency: parseInt(calibrationFrequency, 10),
      supportLoadBankCalibration,
      supportKlufeCalibration,
      categories,
      handleResponse: (response) => {
        if (response.success) {
          toast.success(response.message);
          updateHistory(modelNumber, vendor);
        } else {
          toast.error(response.message);
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
    supportLoadBankCalibration,
    supportKlufeCalibration,
    categories,
  } = model;

  return (
    <>
      {completeFetch
      && (
        <>
          <ModelForm
            modelNumber={modelNumber}
            vendor={vendor}
            description={description}
            comment={comment}
            categories={categories}
            calibrationFrequency={calibrationFrequency}
            supportLoadBankCalibration={supportLoadBankCalibration}
            supportKlufeCalibration={supportKlufeCalibration}
            handleFormSubmit={handleSubmit}
            validated={false}
            diffSubmit
            viewOnly={!(user.isAdmin || user.modelPermission)}
            deleteBtn={deleteBtn}
            type="edit"
          />
        </>
      )}
    </>
  );
}
