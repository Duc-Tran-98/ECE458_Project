/*
This class is starting to get a bit complex, so may want
to refactor this into smaller components when possible;
minor feature that would be cool is spinners while the modal alert loads;
*/
import { useState, useContext } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import Query from '../components/UseQuery';
import DisplayGrid from '../components/UITable';
import MouseOverPopover from '../components/PopOver';
import ModalAlert from '../components/ModalAlert';
import EditModel from '../components/EditModel';
import DeleteModel from '../queries/DeleteModel';
import UserContext from '../components/UserContext';

function ListModels() {
  const user = useContext(UserContext);
  const [rows, setModels] = useState([]);
  const [queried, setQuery] = useState(false);
  const [checked, setChecked] = useState('');
  const [show, setShow] = useState(false);
  const [which, setWhich] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [vendor, setVendor] = useState('');

  const GET_MODELS_QUERY = gql`
    query Models{
      getAllModels{
        id
        vendor
        modelNumber
        description
        calibrationFrequency
      }
    }
  `;
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getAllModels';
  const handleResponse = (response) => {
    setModels(response);
  };
  if (!queried) {
    Query({ query, queryName, handleResponse });
    setQuery(true);
  }
  const cellHandler = (e) => {
    if (e.field === 'view' || e.field === 'delete' || e.field === 'edit') {
      setModelNumber(e.row.modelNumber);
      setVendor(e.row.vendor);
      setWhich(e.field);
      setShow(true);
    }
  };
  const closeModal = (bool) => {
    setShow(false);
    setWhich('');
    if (bool) { // If updated successfully, update rows
      Query({ query, queryName, handleResponse });
    }
  };
  const handleRes = (response) => {
    // eslint-disable-next-line no-alert
    alert(response.message);
    closeModal(response.success);
  };
  const delModel = () => {
    DeleteModel({ modelNumber, vendor, handleResponse: handleRes });
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
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'calibrationFrequency',
      headerName: 'Calibration Frequency',
      width: 200,
      type: 'number',
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 0 ? (
              <MouseOverPopover message="Model not calibratable">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 32 32"
                >
                  {/* eslint-disable-next-line max-len */}
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                  {/* eslint-disable-next-line max-len */}
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
    {
      field: 'view',
      headerName: ' ',
      width: 60,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View Model">
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
              <MouseOverPopover message="Edit Model">
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
              <MouseOverPopover message="Delete Model">
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

  // TODO: Implement export testing
  const handleExport = () => {
    // Selected comes in with row IDs, now parse these
    const exportRows = [];
    if (checked) {
      checked.forEach((rowID) => {
        rows.forEach((row) => {
          if (row.id === rowID) {
            exportRows.push(row);
          }
        });
      });
      console.log('exportRows: ');
      console.log(exportRows);
    }
  };

  return (
    <div style={{ height: '90vh' }}>
      <ModalAlert handleClose={closeModal} show={show} title={which}>
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
        {which === 'delete' && (
          <div>
            <div className="h4 row text-center">{`You are about to delete ${vendor}:${modelNumber}. Are you sure?`}</div>
            <div className="d-flex justify-content-center">
              <div className="me-5">
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={delModel}
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
      {DisplayGrid({
        rows, cols, cellHandler, handleExport, setChecked,
      })}
    </div>
  );
}
export default ListModels;
