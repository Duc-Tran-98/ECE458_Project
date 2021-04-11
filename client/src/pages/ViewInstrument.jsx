/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { gql } from '@apollo/client';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import DataGrid from '../components/UITable';
import { cols } from '../utils/CalibTable';
import DeleteInstrument from '../queries/DeleteInstrument';
import GetCalibHistory from '../queries/GetCalibHistory';
import MouseOverPopover from '../components/PopOver';
import CalibrationTable from '../components/CalibrationTable';
import UserContext from '../components/UserContext';
import AddCalibEventByAssetTag from '../queries/AddCalibEventByAssetTag';
import ModalAlert, { StateLessModal, StateLessCloseModal } from '../components/ModalAlert';
import InstrumentForm from '../components/InstrumentForm';
import Query from '../components/UseQuery';
import LoadBankWiz from '../components/LoadBankWiz';
import KlufeWiz from '../components/KlufeWiz';
import FindInstrument, { FindInstrumentById } from '../queries/FindInstrument';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4001'
  : '/express';

export default function DetailedInstrumentView() {
  const user = React.useContext(UserContext);
  const history = useHistory();
  const [showDelete, setShowDelete] = React.useState(false);

  // This code is getting params from url
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [loading, setLoading] = React.useState(false); // loading status of delete query
  const [supportsLoadBankWiz, setSupportsLoadBankWiz] = React.useState(false); // bool for load bank wiz support
  const [supportsKlufeWiz, setSupportsKlufeWiz] = React.useState(false);
  const [show, setShow] = React.useState(false); // show add calib event modal or not
  const [update, setUpdate] = React.useState(false); // bool to indicate when to update form
  const [fetched, setFetched] = React.useState(false); // bool to indicate when to display inst form (after we get the info)
  const [formState, setFormState] = React.useState({ // our state we display to user
    modelNumber: urlParams.get('modelNumber'),
    vendor: urlParams.get('vendor'),
    serialNumber: '',
    description: '',
    categories: [],
    comment: '',
    id: 0,
    calibrationFrequency: 0,
    assetTag: parseInt(urlParams.get('assetTag'), 10),
  });
  const handleResponse = (response) => { // handle deletion
    setLoading(false);
    setShowDelete(false);
    if (response.success) {
      toast.success(response.message, {
        toastId: -1,
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
        toastId: -8,
      });
    }
  };
  const handleDelete = () => {
    setLoading(true);
    DeleteInstrument({ id: formState.id, handleResponse });
  };
  // This code  is getting calibration frequency, calibration history and comment of instrument
  const [calibHist, setCalibHist] = useState([]);
  const [nextId, setNextId] = useState(0);
  const fetchData = (excludeEntry = null, id = null) => {
    // This will refetch calib history and set it as our state
    GetCalibHistory({ id: id || formState.id }).then((data) => {
      let counter = nextId;
      data.forEach((item) => {
        // console.log(item);
        item.id = counter;
        item.viewOnly = true;
        counter += 1;
      });
      const openEdits = calibHist.filter((element) => !element.viewOnly && (!excludeEntry || excludeEntry?.id !== element.id));
      setCalibHist(openEdits.concat(data));
      setNextId(counter);
    });
  };
  const addRow = () => {
    // This adds an entry to the array(array = calibration history)
    if (calibHist.filter((ele) => !ele.viewOnly).length === 0) {
      const newHistory = calibHist;
      newHistory.push({
        user: user.userName,
        date: new Date().toISOString().split('T')[0], // The new Date() thing defaults date to today
        comment: '',
        id: nextId,
        viewOnly: false,
      });
      setNextId(nextId + 1);
      setCalibHist(newHistory);
    }
  };
  const deleteRow = (rowId) => {
    const newHistory = calibHist.filter((item) => item.id !== rowId);
    setCalibHist(newHistory);
  };
  const onChangeCalibRow = (e, entry) => {
    // This method deals with updating a particular calibration event
    const newHistory = [...calibHist];
    const index = newHistory.indexOf(entry);
    newHistory[index] = { ...entry };
    if (e.target.name === 'user') {
      newHistory[index].user = e.target.value;
    } else if (e.target.name === 'date') {
      newHistory[index].date = e.target.value;
    } else if (e.target.name === 'fileInput') {
      if (e.target.remove === true) {
        newHistory[index].file = null;
      } else {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        newHistory[index].file = data;
      }
    } else {
      newHistory[index].comment = e.target.value;
    }
    setCalibHist(newHistory);
  };
  const handleSubmit = async (entry) => {
    // const validEvents = calibHist.filter((entry) => !entry.viewOnly); // Collect valid entries
    const newHistory = [entry];
    setShow(false);
    if (entry.file) {
      const endpoint = '/api/upload';
      const path = `${route}${endpoint}`;
      await axios.post(path, entry.file, {
        // receive two    parameter endpoint url ,form data
      }).then((res) => { // then print response status
        // eslint-disable-next-line no-param-reassign
        entry.fileLocation = res.data.assetName;
        // eslint-disable-next-line no-param-reassign
        entry.fileName = res.data.fileName;
      // eslint-disable-next-line no-unused-vars
      }).catch((err) => {
        // console.log(err.message);
      });
    }
    AddCalibEventByAssetTag({
      events: newHistory,
      assetTag: formState.assetTag,
      handleResponse: () => {
        toast.success(`Added calibration event on ${entry.date}`);
        fetchData(entry);
      },
    });
  };

  // eslint-disable-next-line no-unused-vars
  history.listen((location) => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      if (!update) {
        // const {state } = location;
        setUpdate(true);
      }
    })();
    return () => { active = false; };
  });

  const updateState = (response) => { // function to update our state
    setFetched(false);
    const categories = response.instrumentCategories.map((item) => item.name);
    let {
      comment,
      description,
      calibrationFrequency,
      modelNumber,
      vendor,
      serialNumber,
      assetTag,
      id,
    } = response;
    if (typeof id === 'undefined') {
      id = formState.id;
    }
    if (typeof id === 'string') {
      id = parseInt(id, 10);
    }
    fetchData(null, id);
    comment = comment || '';
    modelNumber = modelNumber || '';
    vendor = vendor || '';
    serialNumber = serialNumber || '';
    assetTag = assetTag || '';
    calibrationFrequency = calibrationFrequency || '';
    description = description || '';
    setFormState({
      ...formState,
      comment,
      description,
      calibrationFrequency,
      categories,
      modelNumber,
      vendor,
      serialNumber,
      assetTag,
      id,
    });
    setUpdate(false);
    setFetched(true);
  };

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      Query({
        query: gql`
          query GetCalibSupport($modelNumber: String!, $vendor: String!) {
            getModel(modelNumber: $modelNumber, vendor: $vendor) {
              supportLoadBankCalibration
              supportKlufeCalibration
            }
          }
        `,
        queryName: 'getModel',
        getVariables: () => ({ modelNumber: formState.modelNumber, vendor: formState.vendor }),
        handleResponse: (response) => {
          setSupportsLoadBankWiz(response.supportLoadBankCalibration);
          setSupportsKlufeWiz(response.supportKlufeCalibration);
        },
      });
      FindInstrument({
        assetTag: formState.assetTag,
        handleResponse: updateState,
      });
    })();
    return () => {
      active = false;
    };
  }, []); // on mount, get calib hist and inst info

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      if (update) {
        FindInstrumentById({
          id: formState.id,
          handleResponse: updateState,
        });
      }
    })();
    return () => { active = false; };
  }, [update]);

  const genCalibButtons = (
    <div className="d-flex flex-row">
      {(user.isAdmin || user.calibrationPermission) && (
        <>
          <MouseOverPopover message="Add a new calibration event">
            <button
              type="button"
              onClick={() => {
                addRow();
                setShow(true);
              }}
              className="btn"
            >
              Add Calibration
            </button>
          </MouseOverPopover>
          <StateLessModal
            show={show}
            title="Add Calibration Event"
            handleClose={() => setShow(false)}
          >
            <CalibrationTable
              rows={calibHist.filter((ele) => !ele.viewOnly)}
              deleteRow={deleteRow}
              onChangeCalibRow={onChangeCalibRow}
              showSaveButton
              showDeleteBtn={false}
              onSaveClick={handleSubmit}
            />
          </StateLessModal>
          {supportsLoadBankWiz && (
            <div className="ms-2">
              <ModalAlert
                btnText="Add Load Bank Calibration"
                title="Load Bank Wizard"
                popOverText="Add a load bank calibration via our wizard"
              >
                <LoadBankWiz
                  initModelNumber={formState.modelNumber}
                  initSerialNumber={formState.serialNumber}
                  initAssetTag={formState.assetTag}
                  initVendor={formState.vendor}
                  onFinish={fetchData}
                />
              </ModalAlert>
            </div>
          )}
          {supportsKlufeWiz && (
            <div className="ms-2">
              <ModalAlert
                btnText="Add Klufe Calibration"
                title="Add Klufe Calibration"
                popOverText="Add calibration via Klufe"
              >
                <KlufeWiz
                  initModelNumber={formState.modelNumber}
                  initSerialNumber={formState.serialNumber}
                  initAssetTag={formState.assetTag}
                  initVendor={formState.vendor}
                  onFinish={fetchData}
                />
              </ModalAlert>
            </div>
          )}
          {calibHist.filter((entry) => entry.viewOnly).length > 0 && (
            <MouseOverPopover
              className="ms-2"
              message="View instrument's calibration certificate"
            >
              <Link
                className="btn text-nowrap"
                to={`/viewCertificate/?modelNumber=${formState.modelNumber}&vendor=${formState.vendor}&assetTag=${formState.assetTag}`}
              >
                View Certificate
              </Link>
            </MouseOverPopover>
          )}
        </>
      )}
    </div>
  );

  const deleteConfirm = (
    <>
      <div className="h5 text-center my-3">{`You are about to delete ${formState.vendor}:${formState.modelNumber}:${formState.assetTag}. Are you sure?`}</div>
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

  const footer = (
    <>
      <MouseOverPopover message="Go to model's detail view">
        <Link
          className="text-nowrap"
          to={`/viewModel/?modelNumber=${formState.modelNumber}&vendor=${formState.vendor}`}
        >
          View Model
        </Link>
      </MouseOverPopover>
    </>
  );
  const ref = React.useRef(null);
  return (
    <>
      <div className="row">
        <div className="col p-3 border border-right border-dark">
          {fetched && (
            <>
              <h3 className="px-3 bg-secondary text-light my-auto">
                Instrument Information
              </h3>
              <InstrumentForm
                editBtnRef={ref}
                modelNumber={formState.modelNumber}
                vendor={formState.vendor}
                comment={formState.comment}
                serialNumber={formState.serialNumber}
                categories={formState.categories}
                viewOnly
                description={formState.description}
                calibrationFrequency={formState.calibrationFrequency}
                assetTag={formState.assetTag}
                id={formState.id}
                type="edit"
                deleteBtn={deleteBtn}
                handleFormSubmit={handleSubmit}
                footer={footer}
              />
              {deleteModal}
            </>
          )}
        </div>
        <div
          className="col p-3 border border-left border-dark"
          id="remove-if-empty"
        >
          <div
            className="h-100"
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
          >
            <div
              className="bg-secondary text-light sticky-top"
              style={{ zIndex: '1' }}
            >
              <div className="col px-3 w-100">
                <h3 className="px-3 bg-secondary text-light my-auto row">
                  Calibration History
                </h3>
                {formState.calibrationFrequency > 0 && (
                  <div className="row py-2">{genCalibButtons}</div>
                )}
              </div>
            </div>
            {formState.calibrationFrequency > 0 ? (
              <DataGrid
                rows={calibHist.filter((ele) => ele.viewOnly)}
                cols={cols}
              />
            ) : (
              <div className="row mt-3">
                <p className="text-center h5">Instrument not calibratable</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center py-3" ref={ref} />
    </>
  );
}
