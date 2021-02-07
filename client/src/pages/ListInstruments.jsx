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
// import UserContext from '../components/UserContext';
// import ErrorPage from './ErrorPage';

function deleteEntry() {
  // eslint-disable-next-line no-alert
  alert('Deleting entry initiated');
}

function editEntry() {
  // eslint-disable-next-line no-alert
  alert('Edit entry initiated');
}

function focusEntry() {
  // eslint-disable-next-line no-alert
  alert('Focus entry initiated');
}

function ListInstruments() {
  // const user = useContext(UserContext);
  // console.log(user);
  // if (!user.isLoggedIn) {
  //   return <ErrorPage message="You need to sign in to see this page!" />;
  // }
  const [rows, setInstruments] = useState([]);
  const [queried, setQueried] = useState(false);
  const GET_INSTRUMENTS_QUERY = gql`
    query Instruments{
      getAllInstruments{
        id
        vendor
        modelNumber
        serialNumber
        modelReference
        comment
        calibrationFrequency
      }
    }
  `;
  const query = print(GET_INSTRUMENTS_QUERY);
  const queryName = 'getAllInstruments';
  const handleResponse = (response) => {
    // console.log(`getAllInstruments\n${response}`);
    setInstruments(response);
  };
  if (!queried) {
    setQueried(true);
    Query({ query, queryName, handleResponse });
  }
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
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
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
    { field: 'comment', headerName: 'Comment', width: 300 },
    {
      field: 'options',
      headerName: ' ',
      width: 100,
      renderCell: () => (
        <div>
          <ButtonBase onClick={editEntry}>
            <EditIcon color="primary" />
          </ButtonBase>
          <ButtonBase onClick={deleteEntry}>
            <DeleteIcon color="secondary" />
          </ButtonBase>
          <ButtonBase onClick={focusEntry}>
            <SearchIcon />
          </ButtonBase>
        </div>
      ),
    },
  ];
  return DisplayGrid({ rows, cols });
}
export default ListInstruments;
