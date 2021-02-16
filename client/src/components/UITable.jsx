/* eslint-disable react/require-default-props */
import * as React from 'react';
import {
  DataGrid, GridToolbar,
} from '@material-ui/data-grid';
// import { GridToolbar, FilterToolbarButton, ColumnsToolbarButton, DensitySelector, } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import useStateWithCallback from 'use-state-with-callback';
import {
  useState, useRef, useEffect,
} from 'react';
import { CSVLink } from 'react-csv';

import ExportInstruments from './ExportInstruments';
import ExportModels from './ExportModels';

export default function DisplayGrid({
  rows, cols, cellHandler,
}) {
  DisplayGrid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired,
    cellHandler: PropTypes.func,
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={cols}
        pageSize={10}
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
        onCellClick={(e) => {
          if (cellHandler) {
            cellHandler(e);
          }
        }}
        disableSelectionOnClick
        className="bg-light"
      />
    </div>
  );
}

export function ServerPaginationGrid({
  fetchData,
  cols,
  cellHandler,
  getRowCount,
  shouldUpdate,
  filterRowForCSV,
  headers,
  filename,
}) {
  ServerPaginationGrid.propTypes = {
    fetchData: PropTypes.func.isRequired, // This is what is called to get more data
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired, // This is for displaying columns
    // eslint-disable-next-line react/require-default-props
    cellHandler: PropTypes.func,
    getRowCount: PropTypes.func.isRequired,
    shouldUpdate: PropTypes.bool,
    filterRowForCSV: PropTypes.func.isRequired, // function to filter rows for export
    // eslint-disable-next-line react/forbid-prop-types
    headers: PropTypes.array.isRequired, // map db keys to CSV headers
    filename: PropTypes.string.isRequired, // name the csv file
  };
  ServerPaginationGrid.defaultProps = {
    shouldUpdate: false,
  };
  const [limit, setLimit] = React.useState(25); // Can make this bigger if you want; configs how many rows to display/page
  const [page, setPage] = React.useState(1);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(null);
  const handlePageChange = (params) => {
    setPage(params.page);
  };
  const handlePageSizeChange = (e) => {
    setLimit(e.pageSize);
  };
  React.useEffect(() => {
    let active = true;
    getRowCount().then((val) => setRowCount(val));
    (async () => {
      setLoading(true);
      const offset = (page - 1) * limit;
      const newRows = await fetchData(limit, offset);
      if (!active) {
        return;
      }
      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [shouldUpdate]);
  React.useEffect(() => {
    let active = true;
    if (rowCount === null) {
      getRowCount().then((val) => (setRowCount(val)));
    }

    (async () => {
      setLoading(true);
      const offset = (page - 1) * limit;
      const newRows = await fetchData(limit, offset);
      if (!active) {
        return;
      }
      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [page, limit]);

  const [checked, setChecked] = useState('');
  const csvLink = useRef();

  const [downloadReady, setDownloadReady] = useStateWithCallback(false, () => {
    if (downloadReady) {
      setDownloadReady(false);
    }
  });

  // Everytime setCSVData, want to download
  const [csvData, setCSVData] = useStateWithCallback([], () => {
    if (csvData.length > 0) {
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

  // Function for exporting data
  const handleExport = () => {
    // Selected comes in with row IDs, now parse these
    const exportRows = [];
    if (checked) {
      checked.forEach((rowID) => {
        rows.forEach((row) => {
          // eslint-disable-next-line eqeqeq
          if (row.id == rowID) {
            exportRows.push(row);
          }
        });
      });
      const filteredRows = filterRowForCSV(exportRows);
      setCSVData(filteredRows);
    }
  };

  return (
    <div style={{ width: '100%', height: '400' }}>
      <CSVLink
        data={csvData}
        headers={headers}
        filename={filename}
        className="hidden"
        ref={csvLink}
      />
      {handleExport && (
      <span>
        {filename.includes('model') && <ExportModels />}
        {filename.includes('instrument') && <ExportInstruments />}
        <Button onClick={handleExport} className="m-2">Export Selected Rows</Button>
      </span>
      )}
      <DataGrid
        rows={rows}
        columns={cols}
        checkboxSelection
        pagination
        pageSize={limit}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={handlePageChange}
        loading={loading}
        className="bg-light"
        rowsPerPageOptions={[25, 50, 100]}
        locateText={{
          toolbarDensity: 'Size',
          toolbarDensityLabel: 'Size',
          toolbarDensityCompact: 'Small',
          toolbarDensityStandard: 'Medium',
          toolbarDensityComfortable: 'Large',
        }}
        onPageSizeChange={(e) => handlePageSizeChange(e)}
        onCellClick={(e) => {
          if (cellHandler) {
            cellHandler(e);
          }
        }}
        autoHeight
        onSelectionChange={(newSelection) => {
          setChecked(newSelection.rowIds);
        }}
        showToolbar
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
