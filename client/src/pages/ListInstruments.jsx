/* eslint-disable func-names */
/* eslint-disable max-len */
import { useState, useContext } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import GetAllInstruments, { CountInstruments } from '../queries/GetAllInstruments';
import { ServerPaginationGrid } from '../components/UITable';
import MouseOverPopover from '../components/PopOver';
import ModalAlert from '../components/ModalAlert';
import UserContext from '../components/UserContext';
import DeleteInstrument from '../queries/DeleteInstrument';
import EditInstrument from '../components/EditInstrument';
import GetCalibHistory from '../queries/GetCalibHistory';

// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days) { // This allows you to add days to a date object and get a new date object
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default function ListInstruments() {
  const user = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [which, setWhich] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');
  const cellHandler = (e) => {
    if (e.field === 'view' || e.field === 'delete' || e.field === 'edit') {
      setModelNumber(e.row.modelNumber);
      setVendor(e.row.vendor);
      setWhich(e.field);
      setId(e.row.id);
      setSerialNumber(e.row.serialNumber);
      setDescription(e.row.description);
      setShow(true);
    }
  };
  const genDaysLeft = (date) => {
    const today = new Date();
    const exp = new Date(date);
    return Math.round((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };
  const genClassName = (daysLeft) => {
    if (daysLeft > 30) {
      return 'text-success';
    }
    if (daysLeft > 0 && daysLeft <= 30) {
      return 'text-warning';
    }
    return 'text-danger';
  };
  const closeModal = () => {
    setShow(false);
    setWhich('');
  };
  const handleRes = (response) => {
    // eslint-disable-next-line no-alert
    alert(response.message);
    closeModal(response.success);
  };
  const delInstrument = () => {
    DeleteInstrument({ id, handleResponse: handleRes });
  };
  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
    },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 225 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    {
      field: 'date',
      headerName: 'Most Recent Calibration',
      width: 250,
      type: 'date',
    },
    {
      field: 'calibrationStatus',
      headerName: 'Calibration Expiration',
      width: 200,
      type: 'number',
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 'OoO' && (
              <MouseOverPopover
                className="mb-3"
                message="Instrument not calibrated!"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-emoji-angry-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 0 1 .166.76c.071.206.111.44.111.687C7 7.328 6.552 8 6 8s-1-.672-1-1.5c0-.408.109-.778.285-1.049l-1.009-.504a.5.5 0 0 1-.223-.67zm.232 8.157a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 1 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5 0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5z" />
                </svg>
              </MouseOverPopover>
            )}
            {params.value === 'NA' ? (
              <MouseOverPopover
                className="mb-3"
                message="Instrument not calibratable"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </MouseOverPopover>
            ) : (
              params.value !== 'OoO' && (
                <MouseOverPopover
                  className="mb-3"
                  message={`${genDaysLeft(params.value)} days left till next calibration`}
                >
                  <span className={genClassName(genDaysLeft(params.value))}>{params.value}</span>
                </MouseOverPopover>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      field: 'view',
      headerName: ' ',
      width: 60,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View Instrument">
              <Link
                to={`/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&serialNumber=${serialNumber}&description=${description}&id=${id}`}
              >
                <SearchIcon />
              </Link>
            </MouseOverPopover>
          </div>
        </div>
      ),
    },
  ];
  if (user.isAdmin) {
    cols.push(
      {
        field: 'edit',
        headerName: ' ',
        width: 60,
        disableColumnMenu: true,
        renderCell: () => (
          <div className="row">
            <div className="col mt-1">
              <MouseOverPopover message="Edit Instrument">
                <ButtonBase>
                  <EditIcon color="primary" />
                </ButtonBase>
              </MouseOverPopover>
            </div>
          </div>
        ),
      },
      {
        field: 'delete',
        headerName: ' ',
        width: 60,
        disableColumnMenu: true,
        renderCell: () => (
          <div className="row">
            <div className="col mt-1">
              <MouseOverPopover message="Delete Instrument">
                <ButtonBase>
                  <DeleteIcon color="secondary" />
                </ButtonBase>
              </MouseOverPopover>
            </div>
          </div>
        ),
      },
    );
  }
  return (
    <div style={{ height: '90vh' }}>
      <ModalAlert handleClose={closeModal} show={show} title={which}>
        {which === 'edit' && (
          <EditInstrument
            modelNumber={modelNumber}
            vendor={vendor}
            handleClose={closeModal}
            serialNumber={serialNumber}
          />
        )}
        {which === 'delete' && (
          <div>
            <div className="h4 row text-center">{`You are about to delete ${vendor}-${modelNumber}-${serialNumber}. Are you sure?`}</div>
            <div className="d-flex justify-content-center">
              <div className="me-5">
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={delInstrument}
                >
                  Yes
                </button>
              </div>
              <div className="ms-5">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={closeModal}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalAlert>
      <ServerPaginationGrid
        cols={cols}
        getRowCount={CountInstruments}
        cellHandler={cellHandler}
        fetchData={(limit, offset) => GetAllInstruments({ limit, offset }).then((response) => {
          response.forEach((element) => {
            GetCalibHistory({
              // Get calibration history for each instrument
              id: element.id,
              mostRecent: true,
            }).then((value) => {
              // eslint-disable-next-line no-param-reassign
              element.date = element.calibrationFrequency === 0
                ? 'Item not calibratable'
                : 'Not calibrated';
              // eslint-disable-next-line no-param-reassign
              element.calibrationStatus = element.calibrationFrequency === 0 ? 'NA' : 'OoO';
              // eslint-disable-next-line no-param-reassign
              element.user = value ? value.user : 'No user found';
              // eslint-disable-next-line no-param-reassign
              element.calibComment = value
                ? value.comment
                : 'No comment found';
              if (value) {
                // eslint-disable-next-line no-param-reassign
                element.date = value.date;
                const nextCalibDate = new Date(value.date)
                  .addDays(element.calibrationFrequency)
                  .toISOString()
                  .split('T')[0];
                  // eslint-disable-next-line no-param-reassign
                element.calibrationStatus = nextCalibDate;
              }
            });
          });
          return response;
        })}
      />
    </div>
  );
}
