import { useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import Query from '../components/UseQuery';
import DisplayGrid from '../components/UITable';
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
    console.log(`getAllInstruments\n${response}`);
    setInstruments(response);
  };
  if (rows === null || rows.length === 0) {
    Query({ query, queryName, handleResponse });
  }
  const cols = [
    { field: 'id', headerName: 'Numb', width: 50 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 300 },
    { field: 'isCalibratable', headerName: 'Calib', width: 50 },
    { field: 'comment', headerName: 'Comment', width: 300 },
    {
      field: 'options',
      headerName: ' ',
      width: 100,
      renderCell: () => (
        <div>
          <ButtonBase
            onClick={editEntry}
          >
            <EditIcon color="primary" />
          </ButtonBase>
          <ButtonBase
            onClick={deleteEntry}
          >
            <DeleteIcon color="secondary" />
          </ButtonBase>
          <ButtonBase
            onClick={focusEntry}
          >
            <SearchIcon />
          </ButtonBase>
        </div>
      ),
    },
  ];
  return DisplayGrid({ rows, cols });
}
export default ListInstruments;
