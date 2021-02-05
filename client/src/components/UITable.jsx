import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import PropTypes from 'prop-types';

const columns = [
  { field: 'id', headerName: '#', width: 50 },
  { field: 'vendor', headerName: 'Vendor', width: 150 },
  { field: 'modelNumber', headerName: 'Model Number', width: 150 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'serialNumber', headerName: 'Serial Number', width: 200 },
  { field: 'calibrationDate', headerName: 'Calibration Date', width: 200 },
];

const testRows = [
  {
    id: 1,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 2,
    vendor: 'Fluke',
    modelNumber: '342V',
    description: 'This is a cool instrument',
    serialNumber: 'AB9870-3452-908JD',
    calibrationDate: '12/21/20',
  },
  {
    id: 3,
    vendor: 'Fluke',
    modelNumber: '123',
    description: 'This is a not cool instrument',
    serialNumber: '12398743',
    calibrationDate: '1/20/21',
  },
  {
    id: 4,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 5,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 6,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 7,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 8,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 9,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 10,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 11,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },
  {
    id: 12,
    vendor: 'Fluke',
    modelNumber: '87V',
    description: 'This is a cool instrument',
    serialNumber: '9870-3452-908JD',
    calibrationDate: '12/25/20',
  },

];

export default function DataGridDemo() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={testRows} columns={columns} pageSize={4} checkboxSelection />
    </div>
  );
}

export function DisplayGrid({ rows, cols }) {
  DisplayGrid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired,
  };
  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={cols}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        pagination
        className="bg-light mt-5"
      />
    </div>
  );
}
