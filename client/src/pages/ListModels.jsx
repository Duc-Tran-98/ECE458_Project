import { useState, useContext } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import Query from '../components/UseQuery';
import DisplayGrid from '../components/UITable';
import UserContext from '../components/UserContext';
import MouseOverPopover from '../components/PopOver';
import ModalAlert from '../components/ModalAlert';
import ErrorPage from './ErrorPage';

function ListModels() {
  const user = useContext(UserContext);
  // console.log(user);
  if (!user.isLoggedIn) {
    return <ErrorPage message="You need to sign in to see this page!" />;
  }
  const [rows, setModels] = useState([]);
  const [show, setShow] = useState(false);
  const [which, setWhich] = useState('');
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
      <ModalAlert handleClose={closeModal} show={show} title={which} />
      {DisplayGrid({ rows, cols, cellHandler })}
    </div>
  );
}
export default ListModels;
