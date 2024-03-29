/* eslint-disable react/require-default-props */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/no-cycle
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
  footer,
  deleteBtn,
  viewOnly = false,
}) {
  EditInstrument.propTypes = {
    initVendor: PropTypes.string.isRequired,
    initModelNumber: PropTypes.string.isRequired,
    initSerialNumber: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    footer: PropTypes.node,
    initAssetTag: PropTypes.number.isRequired,
    deleteBtn: PropTypes.node.isRequired,
    viewOnly: PropTypes.bool,
  };
  EditInstrument.defaultProps = {
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
      comment,
      calibrationFrequency,
      modelNumber,
      vendor,
      serialNumber,
      assetTag,
    } = response;
    comment = comment || '';
    modelNumber = modelNumber || '';
    vendor = vendor || '';
    serialNumber = serialNumber || '';
    assetTag = assetTag || '';
    calibrationFrequency = calibrationFrequency || '';
    setFormState({
      ...formState,
      comment,
      calibrationFrequency,
      categories,
      modelNumber,
      vendor,
      serialNumber,
      assetTag,
    });
    setCompleteFetch(true);
  };

  useEffect(() => {
    let { assetTag } = formState;
    assetTag = parseInt(assetTag, 10);
    FindInstrument({
      assetTag,
      handleResponse: handleFindInstrument,
    });
  }, []); // empty dependency array, only run once on mount

  const updateHistory = (
    modelNumber,
    vendor,
    assetTag,
  ) => {
    const { state } = history.location;
    history.replace(
      `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&assetTag=${assetTag}`,
      state,
    );
  };

  const handleSubmit = (values) => {
    let {
      comment,
      modelNumber,
      assetTag,
      vendor,
      serialNumber,
      categories,
    } = values;
    const handleResponse = (response) => {
      if (response.success) {
        toast.success(response.message);
        updateHistory(
          modelNumber,
          vendor,
          assetTag,
        );
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
          <InstrumentForm
            modelNumber={modelNumber}
            vendor={vendor}
            comment={comment}
            serialNumber={serialNumber}
            categories={categories}
            viewOnly={!(user.isAdmin || user.instrumentPermission) || viewOnly}
            description={description}
            calibrationFrequency={calibrationFrequency}
            assetTag={assetTag}
            id={id}
            type="edit"
            deleteBtn={deleteBtn}
            handleFormSubmit={handleSubmit}
            footer={footer}
          />
        </>
      )}
    </>
  );
}
