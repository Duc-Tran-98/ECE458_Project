/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { gql } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ModelForm from '../components/ModelForm';
import InfinityScroll from '../components/InfiniteScroll';
import ModalAlert from '../components/ModalAlert';
import DeleteModel from '../queries/DeleteModel';
import FindModel, { FindModelById } from '../queries/FindModel';

export default function DetailedModelView() {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const [model, setModel] = React.useState({
    // set model state
    modelNumber: urlParams.get('modelNumber'),
    vendor: urlParams.get('vendor'),
    description: '',
    id: '',
    comment: '',
    calibrationFrequency: '',
    supportLoadBankCalibration: false,
    supportKlufeCalibration: false,
    categories: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('');
  const [fetched, setFetched] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const handleFindModel = (response) => {
    setFetched(false);
    const categories = response.categories.map((item) => item.name);
    const {
      description, comment, supportLoadBankCalibration, supportKlufeCalibration,
    } = response;
    let { calibrationFrequency, id } = response;
    if (calibrationFrequency !== null) {
      calibrationFrequency = calibrationFrequency.toString();
    } else {
      calibrationFrequency = 0;
    }
    id = parseInt(id, 10);
    setModel({
      ...model,
      description,
      comment,
      id,
      categories,
      calibrationFrequency,
      supportLoadBankCalibration,
      supportKlufeCalibration,
    });
    setUpdate(false);
    setFetched(true);
  };
  const history = useHistory();
  history.listen((location, action) => {
    let active = true;
    (async () => {
      queryString = location.search;
      urlParams = new URLSearchParams(queryString);
      if (active && action === 'REPLACE') {
        // edit model updates url wit replace action,
        // so update state
        if (!active) {
          return;
        }
        if (!update) {
          setUpdate(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  });
  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      FindModel({
        modelNumber: model.modelNumber,
        vendor: model.vendor,
        handleResponse: handleFindModel,
      });
    })();
    return () => { active = false; };
  }, []);
  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      if (update) {
        FindModelById({ id: model.id, handleResponse: handleFindModel });
      }
    })();
    return () => { active = false; };
  }, [update]);
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      setTimeout(() => {
        setResponseMsg('');
        if (history.location.state?.previousUrl) {
          const path = history.location.state.previousUrl.split(window.location.host)[1];
          history.replace( // This code updates the url to have the correct count
            path,
            null,
          );
        } else {
          history.replace('/', null);
        }
      }, 1000);
    }
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
  const handleDelete = () => {
    setLoading(true);
    DeleteModel({ modelNumber, vendor, handleResponse });
  };
  const deleteBtn = (
    <ModalAlert
      btnText=""
      title="Delete Model"
      altBtnId="delete-model-btn"
      popOverText="Delete this model"
      altBtn={(
        <svg
          id="delete-model-btn"
          style={{ cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-trash-fill mt-2"
          viewBox="0 0 16 16"
        >
          {/* eslint-disable-next-line max-len */}
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
        </svg>
      )}
      altCloseBtnId="close-delete-modal"
    >
      <>
        {responseMsg.length === 0 && (
          <div className="h5 text-center my-3">{`You are about to delete model ${vendor}:${modelNumber}. Are you sure?`}</div>
        )}
        <div className="d-flex justify-content-center">
          {loading ? (
            <CircularProgress />
          ) : responseMsg.length > 0 ? (
            <div className="mx-5 mt-3 h5">{responseMsg}</div>
          ) : (
            <>
              <div className="mt-3">
                <button className="btn" type="button" onClick={handleDelete}>
                  Yes
                </button>
              </div>
              <span className="mx-3" />
              <div className="mt-3">
                <button className="btn " type="button" id="close-delete-modal">
                  No
                </button>
              </div>
            </>
          )}
        </div>
      </>
    </ModalAlert>
  );
  return (
    <>
      <div className="col">
        <div className="row">
          {fetched && (
            <ModelForm
              modelNumber={modelNumber}
              vendor={vendor}
              description={description}
              comment={comment}
              categories={categories}
              calibrationFrequency={calibrationFrequency}
              supportLoadBankCalibration={supportLoadBankCalibration}
              supportKlufeCalibration={supportKlufeCalibration}
              handleFormSubmit={() => undefined}
              validated={false}
              diffSubmit
              viewOnly
              deleteBtn={deleteBtn}
              type="edit"
            />
          )}
        </div>
        <div className="row px-3">
          <div id="scrollableDiv">
            <InfinityScroll
              title="Instances:"
              titleClassName="px-3 bg-secondary text-light my-auto"
              query={gql`
                query GetInstrumentFromModel(
                  $modelNumber: String!
                  $vendor: String!
                  $limit: Int
                  $offset: Int
                ) {
                  getAllInstrumentsWithModel(
                    modelNumber: $modelNumber
                    vendor: $vendor
                    limit: $limit
                    offset: $offset
                  ) {
                    total
                    rows {
                      assetTag
                    }
                  }
                }
              `}
              queryName="getAllInstrumentsWithModel"
              variables={{ modelNumber, vendor }}
              renderItems={(items) => items.map((entry) => (
                <li className="list-group-item" key={entry.id}>
                  <div className="row">
                    <span className="col">
                      Serial #:
                      {' '}
                      {entry.serialNumber || 'N/A'}
                    </span>
                    <span className="col">
                      Asset Tag:
                      {' '}
                      {entry.assetTag}
                    </span>
                    <span className="col-auto me-auto">
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <Link
                        to={{
                          pathname: `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&assetTag=${entry.assetTag}`,
                          state: { previousUrl: window.location.href },
                        }}
                      >
                        View Instrument
                      </Link>
                    </span>
                  </div>
                </li>
              ))}
            />
          </div>
        </div>
      </div>
    </>
  );
}
