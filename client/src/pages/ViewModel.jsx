/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { gql } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import ModelForm from '../components/ModelForm';
import InfinityScroll from '../components/InfiniteScroll';
import { StateLessCloseModal } from '../components/ModalAlert';
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
    supportCustomCalibration: false,
    requiresCalibrationApproval: false,
    customForm: '',
    categories: [],
    calibratorCategories: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [fetched, setFetched] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const handleFindModel = (response) => {
    setFetched(false);
    const categories = response.categories.map((item) => item.name);
    const calibratorCategories = response.calibratorCategories.map((item) => item.name);
    const {
      description, comment, supportLoadBankCalibration, supportKlufeCalibration, supportCustomCalibration, requiresCalibrationApproval, customForm,
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
      calibratorCategories,
      calibrationFrequency,
      supportLoadBankCalibration,
      supportCustomCalibration,
      requiresCalibrationApproval,
      customForm,
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
    if (response.success) {
      toast.success(response.message, {
        toastId: 101,
      });
      setTimeout(() => {
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
    } else {
      toast.error(response.message, {
        toastId: 102,
      });
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
    supportCustomCalibration,
    requiresCalibrationApproval,
    customForm,
    categories,
    calibratorCategories,
  } = model;
  const handleDelete = () => {
    setLoading(true);
    DeleteModel({ modelNumber, vendor, handleResponse });
  };
  const deleteConfirm = (
    <>
      <div className="h5 text-center my-3">{`You are about to delete model ${vendor}:${modelNumber}. Are you sure?`}</div>
      <div className="d-flex justify-content-center">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div className="mt-3">
              <button className="btn btn-delete" type="button" onClick={handleDelete}>
                Yes
              </button>
            </div>
            <span className="mx-3" />
            <div className="mt-3">
              <button className="btn " type="button" onClick={() => setShowDelete(false)}>
                No
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  const deleteBtn = (
    <Button onClick={() => setShowDelete(true)} className="btn btn-delete">Delete</Button>
    // <DeletePopOver onClick={() => setShowDelete(true)} title="Click to delete instrument" />
  );
  const deleteModal = (
    <StateLessCloseModal
      show={showDelete}
      handleClose={() => setShowDelete(false)}
      title="Delete Instrument"
    >
      {deleteConfirm}
    </StateLessCloseModal>
  );

  const ref = React.useRef(null);
  return (
    <>
      <div className="row">
        <div className="col p-3 border border-right border-dark">
          {fetched && (
            <>
              <h3 className="px-3 bg-secondary text-light my-auto">Model Information</h3>
              {deleteModal}
              <ModelForm
                editBtnRef={ref}
                modelNumber={modelNumber}
                vendor={vendor}
                description={description}
                comment={comment}
                categories={categories}
                calibratorCategories={calibratorCategories}
                calibrationFrequency={calibrationFrequency}
                supportLoadBankCalibration={supportLoadBankCalibration}
                supportCustomCalibration={supportCustomCalibration}
                requiresCalibrationApproval={requiresCalibrationApproval}
                customForm={customForm}
                supportKlufeCalibration={supportKlufeCalibration}
                handleFormSubmit={() => undefined}
                validated={false}
                diffSubmit
                viewOnly
                deleteBtn={deleteBtn}
                type="edit"
              />
            </>
          )}
        </div>
        <div className="col p-3 border border-left border-dark" id="remove-if-empty">
          <div id="scrollableDiv" style={{ maxHeight: '72vh', overflowY: 'auto', minHeight: '72vh' }}>
            <InfinityScroll
              title="Instances:"
              titleClassName="px-3 bg-secondary text-light my-auto sticky-top"
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
                      serialNumber
                      id
                    }
                  }
                }
              `}
              queryName="getAllInstrumentsWithModel"
              variables={{ modelNumber, vendor }}
              renderItems={(items) => items.map((entry) => (
                <li className="list-group-item" key={entry.id}>
                  <div className="row w-100">
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
      <div className="d-flex justify-content-center py-3" ref={ref} />
    </>
  );
}
