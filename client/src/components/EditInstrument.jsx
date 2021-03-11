/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InstrumentForm from './InstrumentForm';
import UserContext from './UserContext';
import EditInstrumentQuery from '../queries/EditInstrument';
import FindInstrument from '../queries/FindInstrument';

export default function EditInstrument({
  initVendor,
  initModelNumber,
  initSerialNumber,
  id,
  initAssetTag,
  description,
  handleDelete,
  footer,
}) {
  EditInstrument.propTypes = {
    initVendor: PropTypes.string.isRequired,
    initModelNumber: PropTypes.string.isRequired,
    initSerialNumber: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    handleDelete: PropTypes.func,
    footer: PropTypes.node,
    initAssetTag: PropTypes.number.isRequired,
  };
  EditInstrument.defaultProps = {
    handleDelete: null,
    footer: null,
  };
  const history = useHistory();
  const user = React.useContext(UserContext);
  const [formState, setFormState] = React.useState({
    modelNumber: initModelNumber,
    vendor: initVendor,
    serialNumber: initSerialNumber,
    description,
    categories: [],
    comment: '',
    id,
    calibrationFrequency: 0,
    assetTag: initAssetTag,
  });

  const [completeFetch, setCompleteFetch] = useState(false);

  const handleFindInstrument = (response) => {
    const categories = response.instrumentCategories.map((item) => item.name);
    let {
      comment, calibrationFrequency, modelNumber, vendor, serialNumber, assetTag,
    } = response;
    comment = comment || '';
    modelNumber = modelNumber || '';
    vendor = vendor || '';
    serialNumber = serialNumber || '';
    assetTag = assetTag || '';
    calibrationFrequency = calibrationFrequency || '';
    setFormState({
      ...formState, comment, calibrationFrequency, categories, modelNumber, vendor, serialNumber, assetTag,
    });
    setCompleteFetch(true);
  };

  useEffect(() => {
    let { assetTag } = formState;
    assetTag = parseInt(assetTag, 10);
    FindInstrument({
      assetTag, handleResponse: handleFindInstrument,
    });
  }, []); // empty dependency array, only run once on mount

  const updateHistory = (modelNumber, vendor, assetTag, serialNumber, description, id, calibrationFrequency) => {
    const { state } = history.location;
    history.replace(
      `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}$assetTag=${assetTag}&serialNumber=${serialNumber}&description=${description}&id=${id}&calibrationFrequency=${calibrationFrequency}`,
      state,
    );
  };

  const handleSubmit = (values) => {
    // console.log('EditInstrument handling submit with values: ');
    // console.log(values);
    let {
      comment,
      modelNumber,
      assetTag,
      vendor,
      serialNumber,
      description,
      categories,
      calibrationFrequency,
    } = values;
    const handleResponse = (response) => {
      if (response.success) {
        toast.success(response.message);
        updateHistory(modelNumber, vendor, assetTag, serialNumber, description, id, calibrationFrequency);
      } else {
        toast.error(response.message);
      }
    };
    assetTag = parseInt(assetTag, 10);
    EditInstrumentQuery({
      modelNumber,
      vendor,
      assetTag,
      serialNumber,
      id,
      comment,
      categories,
      handleResponse,
    });
  };

  const {
    modelNumber,
    vendor,
    serialNumber,
    comment,
    categories,
    calibrationFrequency,
    assetTag,
  } = formState;

  return (
    <>
      {completeFetch && (
      <>
        <ToastContainer />
        <InstrumentForm
          modelNumber={modelNumber}
          vendor={vendor}
          comment={comment}
          serialNumber={serialNumber}
          categories={categories}
          viewOnly={!user.isAdmin}
          description={description}
          calibrationFrequency={calibrationFrequency}
          assetTag={assetTag}
          type="edit"
          handleFormSubmit={handleSubmit}
          handleDelete={handleDelete}
          footer={footer}
        />
      </>
      )}
    </>
  );
}
