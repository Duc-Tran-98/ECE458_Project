/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import axios from 'axios';
import CreateInstrument from '../queries/CreateInstrument';
import UserContext from '../components/UserContext';
import InstrumentForm from '../components/InstrumentForm';
import CalibrationTable from '../components/CalibrationTable';
import AddCalibEventByAssetTag from '../queries/AddCalibEventByAssetTag';

// eslint-disable-next-line no-unused-vars
const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4001'
  : '/express';

function CreateInstrumentPage({ onCreation }) {
  CreateInstrumentPage.propTypes = {
    onCreation: PropTypes.func.isRequired,
  };
  const endpoint = '/api/upload';
  const path = `${route}${endpoint}`;
  const user = useContext(UserContext);
  const [calibHist, setCalibHist] = useState([
    {
      user: user.userName,
      date: new Date().toISOString().split('T')[0],
      comment: '',
      id: 0,
      viewOnly: false,
    },
  ]); // calibhistory is the array of calibration events.
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

  const [calibrationFrequency, setcalibrationFrequency] = React.useState(0);
  const [nextId, setNextId] = useState(1); // This is for assining unique ids to our array
  const addRow = () => {
    // This adds an entry to the array(array = calibration history)
    if (calibrationFrequency > 0) {
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
    // This is for deleting an entry from array
    const newHistory = calibHist.filter((item) => item.id !== rowId);
    setCalibHist(newHistory);
  };

  const addCalibEvents = (assetTag) => {
    const validEvents = calibHist;
    if (validEvents.length > 0 && calibrationFrequency > 0) {
      validEvents.forEach(async (entry) => {
        const events = [entry];
        if (entry.file) {
          await axios
            .post(path, entry.file, {
              // receive two    parameter endpoint url ,form data
            })
            .then((res) => {
              // then print response status
              // eslint-disable-next-line no-param-reassign
              events[0].fileLocation = res.data.assetName;
              // eslint-disable-next-line no-param-reassign
              events[0].fileName = res.data.fileName;
            })
            .catch((err) => {
              console.log(err.message);
              toast.error(`Could not upload file for event on ${entry.date}`);
            });
        }
        AddCalibEventByAssetTag({
          events,
          assetTag,
          handleResponse: (r) => toast.success(r.message),
        });
      });
    }
  };

  const handleSubmit = (values, resetForm) => {
    // This is to submit all the data
    let {
      // eslint-disable-next-line prefer-const
      modelNumber,
      vendor,
      assetTag,
      comment,
      serialNumber,
      categories,
    } = values;
    // check validation here in backend?
    if (typeof assetTag === 'string') {
      assetTag = null;
    }

    CreateInstrument({
      modelNumber,
      vendor,
      assetTag,
      serialNumber,
      categories,
      comment,
    }).then((response) => {
      if (response.success) {
        toast.success(response.message);
        resetForm();
        assetTag = response.instrument.assetTag;
        if (typeof assetTag === 'string') {
          assetTag = parseInt(assetTag, 10);
        }
        // If we successfully added new instrument
        // addCalibEvents(assetTag);
        setcalibrationFrequency(0);
        onCreation();
      } else {
        toast.error(response.message);
      }
    });
  };
  // Currently, updating cache is after create instrument and after add calib event doesn't work as expected;
  // so for the time being, I will disable adding calibration events on creation to solve this issue.
  // const footer = (calibrationFrequency !== 0 && (user.isAdmin || user.calibrationPermission)) ? (
  //   <>
  //     <div className="d-flex justify-content-center my-3">
  //       <button type="button" className="btn  mx-3" onClick={addRow}>
  //         Add Calibration Event
  //       </button>
  //     </div>
  //     <CalibrationTable
  //       rows={calibHist}
  //       deleteRow={deleteRow}
  //       onChangeCalibRow={onChangeCalibRow}
  //     />
  //   </>
  // ) : (
  //   <>
  //   </>
  // );
  return (
    <>
      <InstrumentForm
        modelNumber=""
        vendor=""
        comment=""
        serialNumber=""
        categories={[]}
        description=""
        calibrationFrequency={calibrationFrequency}
        assetTag={0}
        handleFormSubmit={handleSubmit}
        updateCalibrationFrequency={(value) => setcalibrationFrequency(value)}
        type="create"
      />
      {/* {footer} */}
    </>
  );
}

export default CreateInstrumentPage;
