/* eslint-disable max-len */
import {
  useState, useContext, useRef, useEffect,
} from 'react';
import useStateWithCallback from 'use-state-with-callback';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import GetAllInstruments from '../queries/GetAllInstruments';
import DisplayGrid from '../components/UITable';
import MouseOverPopover from '../components/PopOver';
import ModalAlert from '../components/ModalAlert';
import UserContext from '../components/UserContext';
import DeleteInstrument from '../queries/DeleteInstrument';
import EditInstrument from '../components/EditInstrument';
import GetCalibHistory from '../queries/GetCalibHistory';
import GetUser from '../queries/GetUser';
// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days) { // This allows you to add days to a date object and get a new date object
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function ListInstruments() {
  const user = useContext(UserContext);
  const [rows, setInstruments] = useState([]);
  const [queried, setQueried] = useState(false);
  const [show, setShow] = useState(false);
  const [which, setWhich] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [calibrationFrequency, setCalibrationFrequency] = useState(0);

  const [checked, setChecked] = useState('');
  const csvLink = useRef();

  const [downloadReady, setDownloadReady] = useStateWithCallback(false, () => {
    if (downloadReady) {
      console.log('Downloading CSV Data');
      csvLink.current.link.click();
      setDownloadReady(false);
    }
  });

  // Everytime setCSVData, want to download
  const [csvData, setCSVData] = useStateWithCallback([], () => {
    console.log('Updating CSV Data');
    if (csvData.length > 0) {
      console.log(JSON.stringify(csvData));
      setDownloadReady(true);
    }
  });

  useEffect(() => {
    if (csvLink && csvLink.current && downloadReady && csvData.length > 0) {
      csvLink.current.link.click();
      setCSVData([]);
      setDownloadReady(false);
    }
  });

  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState('');
  const handleResponse = (response) => {
    response.forEach((element) => {
      GetCalibHistory({ // Get calibration history for each instrument
        id: element.id,
        mostRecent: true,
      }).then((value) => {
        // console.log(value);
        const today = new Date();
        // eslint-disable-next-line no-param-reassign
        element.date = value ? value.date : 'No history found'; // If there's an entry, assign it
        // eslint-disable-next-line no-param-reassign
        element.user = value ? value.user : 'No user found';
        // eslint-disable-next-line no-param-reassign
        element.calibComment = value ? value.comment : 'No comment found';
        // eslint-disable-next-line no-param-reassign
        element.calibrationStatus = 'NA';
        if (value) {
          const nextCalibDate = new Date(value.date).addDays(
            // Calculate next calibration date
            element.calibrationFrequency,
          );
          const daysInBtwn = Math.round(
            (nextCalibDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
          );
          // eslint-disable-next-line no-param-reassign
          element.calibrationStatus = daysInBtwn;
        }
      });
    });
    setInstruments(response);
  };
  if (!queried) {
    setQueried(true);
    GetAllInstruments({ handleResponse });
  }
  const cellHandler = (e) => {
    if (e.field === 'view' || e.field === 'delete' || e.field === 'edit') {
      setModelNumber(e.row.modelNumber);
      setCalibrationFrequency(e.row.calibrationFrequency);
      setVendor(e.row.vendor);
      setWhich(e.field);
      setId(e.row.id);
      setSerialNumber(e.row.serialNumber);
      if (e.field === 'view' && e.row.date !== 'No history found') {
        window.sessionStorage.setItem('serialNumber', e.row.serialNumber);
        window.sessionStorage.setItem('modelNumber', e.row.modelNumber);
        window.sessionStorage.setItem('modelDescription', e.row.description);
        window.sessionStorage.setItem('calibrationDate', e.row.date);
        window.sessionStorage.setItem('expirationDate', new Date(e.row.date).addDays(e.row.calibrationFrequency));
        window.sessionStorage.setItem('calibComment', e.row.calibComment);
        window.sessionStorage.setItem('vendor', e.row.vendor);
        GetUser({ userName: e.row.user }).then((value) => {
          if (value) {
            const calibUser = `Username: ${e.row.user}, First name: ${value.firstName}, Last name: ${value.lastName}`;
            window.sessionStorage.setItem('calibUser', calibUser);
          }
        });
      }
      setShow(true);
    }
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
  const closeModal = (bool) => {
    setShow(false);
    setWhich('');
    if (bool) {
      // If updated successfully, update rows
      GetAllInstruments({ handleResponse });
    }
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
            {params.value === 'NA' ? (
              <MouseOverPopover message="Instrument not calibratable">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 32 32"
                >
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </MouseOverPopover>
            ) : (
              <MouseOverPopover
                message={`${params.value} days left till next calibration`}
              >
                <span className={genClassName(params.value)}>{params.value}</span>
              </MouseOverPopover>
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
              <ButtonBase>
                <SearchIcon />
              </ButtonBase>
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

  const filterRowForCSV = (exportRows) => {
    const filteredRows = exportRows.map((element) => ({
      vendor: element.vendor,
      modelNumber: element.modelNumber,
      serialNumber: element.serialNumber,
      comment: element.comment,
      calibrationDate: element.date,
      calibrationComment: element.calibComment,
    }));
    return filteredRows;
  };

  const handleExport = () => {
    // Selected comes in with row IDs, now parse these
    const exportRows = [];
    if (checked) {
      console.log('checked == true');
      console.log(rows);
      checked.forEach((rowID) => {
        rows.forEach((row) => {
          console.log(row);
          if (row.id === parseInt(rowID, 10)) {
            exportRows.push(row);
          }
        });
      });
      console.log('exportRows: ');
      console.log(exportRows);
      const filteredRows = filterRowForCSV(exportRows);
      console.log('filteredRows');
      console.log(filteredRows);
      setCSVData(filteredRows);
    }
  };

  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Serial-Number', key: 'serialNumber' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Date', key: 'calibrationDate' },
    { label: 'Calibration-Comment', key: 'calibrationComment' },
  ];

  return (
    <div style={{ height: '90vh' }}>
      <ModalAlert handleClose={closeModal} show={show} title={which}>
        {which === 'view' && (
          <div>
            <EditInstrument
              modelNumber={modelNumber}
              vendor={vendor}
              handleClose={closeModal}
              serialNumber={serialNumber}
              viewOnly
            />
            {calibrationFrequency > 0 && (
              <Link to="/viewCertificate">View Certificate</Link>
            )}
          </div>
        )}
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
      {/* eslint-disable-next-line object-shorthand */}
      {DisplayGrid({
        rows, cols, cellHandler, handleExport, setChecked,
      })}
      <CSVLink
        data={csvData}
        headers={headers}
        filename="instruments.csv"
        className="hidden"
        ref={csvLink}
      />
    </div>
  );
}
export default ListInstruments;

/*
{which === 'edit' && (
          <EditModel
            modelNumber={modelNumber}
            vendor={vendor}
            handleClose={closeModal}
          />
        )}
        {which === 'view' && (
          <EditModel
            modelNumber={modelNumber}
            vendor={vendor}
            handleClose={closeModal}
            viewOnly
          />
        )}
            {
      field: 'calibrationFrequency',
      headerName: 'Calibration Frequency',
      width: 200,
      type: 'number',
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 0 ? (
              <MouseOverPopover message="Instrument not calibratable">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 32 32"
                >

                  // eslint-disable-next-line max-len
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />

                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </MouseOverPopover>
            ) : (
              params.value
            )}
          </div>
        </div>
      ),
    },
*/
