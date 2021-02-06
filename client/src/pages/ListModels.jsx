import { useState } from 'react';
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

function ListModels() {
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
    console.log('query for rows');
    Query({ query, queryName, handleResponse });
  }
  const cellHandler = (e) => {
    setModelNumber(e.row.modelNumber);
    setVendor(e.row.vendor);
    setWhich(e.field);
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
    setWhich('');
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
        {which === 'edit' && <EditModel modelNumber={modelNumber} vendor={vendor} />}
      </ModalAlert>
      {DisplayGrid({ rows, cols, cellHandler })}
    </div>
  );
}
export default ListModels;
