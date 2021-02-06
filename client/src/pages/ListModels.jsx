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
    // console.log(response);
    setModels(response);
  };
  if (rows === null || rows.length === 0) {
    // console.log('query for rows');
    Query({ query, queryName, handleResponse });
  }
  const cellHandler = (e) => {
    setModelNumber(e.row.modelNumber);
    setVendor(e.row.vendor);
    setWhich(e.field);
    setShow(true);
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
    { field: 'id', headerName: 'Numb', width: 50 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'calibrationFrequency',
      headerName: 'Calibration Frequency',
      width: 200,
    },
    {
      field: 'edit',
      headerName: ' ',
      width: 60,
      disableColumnMenu: true,
      hide: !user.isAdmin,
      renderCell: () => (
        <div className="row">
          <div className="col mt-2">
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
      hide: !user.isAdmin,
      renderCell: () => (
        <div className="row">
          <div className="col mt-2">
            <MouseOverPopover message="Delete Model">
              <ButtonBase>
                <DeleteIcon color="secondary" />
              </ButtonBase>
            </MouseOverPopover>
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
          <div className="col mt-2">
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
      {DisplayGrid({ rows, cols, cellHandler })}
    </div>
  );
}
export default ListModels;
