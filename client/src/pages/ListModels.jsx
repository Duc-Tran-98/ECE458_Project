/*
This class is starting to get a bit complex, so may want
to refactor this into smaller components when possible;
minor feature that would be cool is spinners while the modal alert loads;
*/
import {
  useState, useContext,
} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllModels, { CountAllModels } from '../queries/GetAllModels';
import MouseOverPopover from '../components/PopOver';
import ModalAlert from '../components/ModalAlert';
import EditModel from '../components/EditModel';
import DeleteModel from '../queries/DeleteModel';
import UserContext from '../components/UserContext';

function ListModels() {
  const user = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [which, setWhich] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [update, setUpdate] = useState(false);
  const cellHandler = (e) => {
    if (e.field === 'view' || e.field === 'delete' || e.field === 'edit') {
      setModelNumber(e.row.modelNumber);
      setVendor(e.row.vendor);
      setWhich(e.field);
      setDescription(e.row.description);
      setShow(true);
    }
  };
  // test
  const closeModal = (bool) => {
    setShow(false);
    setWhich('');
    if (bool) {
      setUpdate(bool);
    }
    setUpdate(false);
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
      field: 'comment',
      headerName: 'Comment',
      width: 400,
      hide: true,
      renderCell: (params) => (
        <div className="overflow-auto">
          {params.value}
        </div>
      ),
    },
    {
      field: 'calibrationFrequency',
      headerName: 'Calibration Frequency',
      width: 195,
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
      headerName: 'View',
      width: 80,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View Model">
              <Link
                to={`/viewModel/?modelNumber=${modelNumber}&vendor=${vendor}&description=${description}`}
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
        headerName: 'Edit',
        width: 80,
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
        headerName: 'Delete',
        width: 100,
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

  // Pass into UITable
  const filterRowForCSV = (exportRows) => {
    const filteredRows = exportRows.map((element) => ({
      vendor: element.vendor,
      modelNumber: element.modelNumber,
      description: element.description,
      comment: element.comment,
      calibrationFrequency: element.calibrationFrequency,
    }));
    return filteredRows;
  };

  const headers = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Model-Number', key: 'modelNumber' },
    { label: 'Short-Description', key: 'description' },
    { label: 'Comment', key: 'comment' },
    { label: 'Calibration-Frequency', key: 'calibrationFrequency' },
  ];

  return (
    <>
      <ModalAlert handleClose={() => closeModal(false)} show={show} title={which}>
        {which === 'edit' && (
          <EditModel
            modelNumber={modelNumber}
            vendor={vendor}
            handleClose={closeModal}
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
                  onClick={() => closeModal(false)}
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
        shouldUpdate={update}
        getRowCount={CountAllModels}
        cellHandler={cellHandler}
        fetchData={(limit, offset) => GetAllModels({ limit, offset }).then((response) => response)}
        filterRowForCSV={filterRowForCSV}
        headers={headers}
        filename="models.csv"
      />
    </>
  );
}
export default ListModels;
