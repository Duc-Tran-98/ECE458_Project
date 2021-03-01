/* eslint-disable no-shadow */
import { gql } from '@apollo/client';
import { print } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import InstrumentForm from './InstrumentForm';
import Query from './UseQuery';
import UserContext from './UserContext';
import EditInstrumentQuery from '../queries/EditInstrument';

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
    initAssetTag: PropTypes.string.isRequired,
  };
  EditInstrument.defaultProps = {
    handleDelete: null,
    footer: null,
  };
  const history = useHistory();
  const user = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false); // if we are waiting for response
  const [responseMsg, setResponseMsg] = React.useState(''); // msg response
  const [formState, setFormState] = React.useState({
    modelNumber: initModelNumber,
    vendor: initVendor,
    serialNumber: initSerialNumber,
    description,
    comment: '',
    id,
    calibrationFrequency: 0,
    assetTag: initAssetTag,
  });
  React.useEffect(() => {
    let active = true;

    (() => {
      if (active) {
        const { modelNumber, vendor, serialNumber } = formState;
        // TODO: add api to get assetTag
        Query({
          query: print(gql`
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
              }
            }
          `),
          queryName: 'getInstrument',
          getVariables: () => ({ modelNumber, vendor, serialNumber }),
          handleResponse: (response) => {
            let { comment, calibrationFrequency } = response;
            if (comment === null) {
              comment = '';
            }
            if (calibrationFrequency === null) {
              calibrationFrequency = 0;
            }
            setFormState({ ...formState, comment, calibrationFrequency });
          },
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [initModelNumber, initVendor, initSerialNumber]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      comment,
      modelNumber,
      vendor,
      serialNumber,
      description,
      id,
      calibrationFrequency,
    } = formState;
    const handleResponse = (response) => {
      setLoading(false);
      setResponseMsg(response.message);
      setTimeout(() => {
        setResponseMsg('');
      }, 1000);
      if (response.success) {
        const { state } = history.location;
        history.replace(
          `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&serialNumber=${serialNumber}&description=${description}&id=${id}&calibrationFrequency=${calibrationFrequency}`,
          state,
        ); // editing => old url no longer valid, so replace it
      }
    };
    // TODO: update api to include assetTag for edit instrument
    EditInstrumentQuery({
      modelNumber,
      vendor,
      serialNumber,
      id,
      comment,
      handleResponse,
    });
  };

  const onInputChange = (_e, v) => {
    // This if for updating instrument's fields from autocomplete input
    setFormState({
      ...formState,
      modelNumber: v.modelNumber,
      vendor: v.vendor,
    });
  };

  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const {
    modelNumber,
    vendor,
    serialNumber,
    comment,
    calibrationFrequency,
    assetTag,
  } = formState;
  const value = { modelNumber, vendor };
  let footElement = null;
  if (user.isAdmin) {
    footElement = responseMsg.length > 0 ? (
      <div className="row">
        <div className="col">
          <button type="button" className="btn  text-nowrap">
            Delete Instrument
          </button>
        </div>
        <div className="col">
          <button type="button" className="btn  text-nowrap">
            {responseMsg}
          </button>
        </div>
        {footer}
      </div>
    ) : (
      <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn  text-nowrap"
            onClick={handleDelete}
          >
            Delete Instrument
          </button>
        </div>
        <div className="col">
          {loading ? (
            <CircularProgress />
          ) : (
            <button
              type="button"
              className="btn  text-nowrap"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          )}
        </div>
        {footer}
      </div>
    ); // foot element controls when to display Save Changes buttion or response msg
  }
  return (
    <>
      <InstrumentForm
        val={value}
        modelNumber={modelNumber}
        vendor={vendor}
        comment={comment}
        serialNumber={serialNumber}
        changeHandler={changeHandler}
        validated={false}
        onInputChange={onInputChange}
        viewOnly={!user.isAdmin}
        description={description}
        calibrationFrequency={calibrationFrequency}
        assetTag={assetTag}
      />
      <div className="d-flex justify-content-center my-3">
        <div className="">{loading ? <CircularProgress /> : footElement}</div>
      </div>
    </>
  );
}
