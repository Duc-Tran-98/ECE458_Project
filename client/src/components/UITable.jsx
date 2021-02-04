import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

// import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';

function deleteEntry() {
  alert('Deleting entry initiated');
}

function editEntry() {
  alert('Edit entry initiated');
}

function focusEntry() {
  alert('Focus entry initiated');
}

const columns = [
  {
    field: 'id', headerName: '#', width: 50, type: 'number',
  },
  { field: 'vendor', headerName: 'Vendor', width: 150 },
  { field: 'modelNumber', headerName: 'Model Number', width: 150 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'serialNumber', headerName: 'Serial Number', width: 200 },
  {
    field: 'lastCalibration', headerName: 'Last Calibration', width: 160, type: 'date',
  },
  {
    field: 'calibrationDue',
    headerName: 'Calibration Due',
    width: 160,
    type: 'number',
    cellClassName: (params) => clsx('super-app', {
      negative: params.value < 30,
      positive: params.value >= 30,
    }),
  },
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

const rows = [
  {
    id: 1,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 10,
  },
  {
    id: 2,
    vendor: 'Fluke',
    modelNumber: '342V',
    description: 'This is a cool instrument',
    serialNumber: 'AB9870-3452-908JD',
    lastCalibration: '12/21/20',
    calibrationDue: 10,
  },
  {
    id: 3,
    vendor: 'Fluke',
    modelNumber: '123',
    description: 'This is a not cool instrument',
    serialNumber: '12398743',
    lastCalibration: '1/20/21',
    calibrationDue: 21,
  },
  {
    id: 4,
    vendor: 'Louis',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 42,
  },
  {
    id: 5,
    vendor: 'Natasha',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 54,
  },
  {
    id: 6,
    vendor: 'Duc',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 87,
  },
  {
    id: 7,
    vendor: 'Duc',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 200,
  },
  {
    id: 8,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 24,
  },
  {
    id: 9,
    vendor: 'GraaphQL',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/21/20',
    calibrationDue: 12,
  },
  {
    id: 10,
    vendor: 'Apollo',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 5,
  },
  {
    id: 11,
    vendor: 'Duke',
    modelNumber: '4321',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 0,
  },
  {
    id: 12,
    vendor: 'Duke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    lastCalibration: '12/25/20',
    calibrationDue: 120,
  },

];

const useStyles = makeStyles({
  root: {
    '& .super-app.positive': {
      backgroundColor: 'rgba(157, 255, 118, 0.49)',
      color: '#1a3e72',
    },
    '& .super-app.negative': {
      backgroundColor: '#ff6863',
      color: '#1a3e72',
    },
    '& .MuiDataGrid-root': {
      backgroundColor: 'bg-light',
    },
    '& .MuiDataGrid-mainGridContainer': {
      background: 'bg-light',
      width: 'fit-content',
    },
  },
});

export default function DataGridDemo() {
  const classes = useStyles();

  return (
    <div
      style={{
        position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'auto', backgroundColor: 'bg-light',
      }}
      className={classes.root}
    >
      <DataGrid
        classes={{
          root: classes.root,
        }}
        rows={rows}
        columns={columns}
        pageSize={12}
        checkboxSelection
        showToolbar
        locateText={{
          toolbarDensity: 'Size',
          toolbarDensityLabel: 'Size',
          toolbarDensityCompact: 'Small',
          toolbarDensityStandard: 'Medium',
          toolbarDensityComfortable: 'Large',
        }}
        autoHeight
        disableSelectionOnClick
      />
    </div>

  );
}
