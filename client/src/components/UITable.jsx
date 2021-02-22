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

import LinearProgress from '@material-ui/core/LinearProgress';
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
  filterRowForCSV,
  headers,
  filename,
  initPage,
  initLimit,
  onPageChange,
  onPageSizeChange,
}) {
  ServerPaginationGrid.propTypes = {
    fetchData: PropTypes.func.isRequired, // This is what is called to get more data
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired, // This is for displaying columns
    // eslint-disable-next-line react/require-default-props
    cellHandler: PropTypes.func,
    getRowCount: PropTypes.func.isRequired,
    filterRowForCSV: PropTypes.func.isRequired, // function to filter rows for export
    // eslint-disable-next-line react/forbid-prop-types
    headers: PropTypes.array.isRequired, // map db keys to CSV headers
    filename: PropTypes.string.isRequired, // name the csv file
    initPage: PropTypes.number,
    initLimit: PropTypes.number,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
  };
  ServerPaginationGrid.defaultProps = {
    initPage: 1,
    initLimit: 25,
    onPageChange: null,
    onPageSizeChange: null,
  };
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [loadingExport, setLoadingExport] = React.useState(null);

  const handlePageChange = (params) => {
    onPageChange(params.page, initLimit);
  };
  const handlePageSizeChange = (e) => {
    // if (initPage !== 1 && e.pageSize >= rowCount) { // if not on first page and want to view >= row count, go back to first page then display
    //   onPageSizeChange(1, e.pageSize);
    // } else {
    //   onPageSizeChange(initPage, e.pageSize);
    // }
    onPageSizeChange(initPage, e.pageSize);
  };

  React.useEffect(() => {
    let active = true;
    getRowCount().then((val) => setRowCount(val));

    (async () => {
      setLoading(true);
      const offset = (initPage - 1) * initLimit;
      const newRows = await fetchData(initLimit, offset);
      if (!active) {
        return;
      }
      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [initLimit, initPage]);

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
  }, [downloadReady]);

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
          {loadingExport && <LinearProgress color="secondary" />}
          {filename.includes('model') && (
            <ExportModels setLoading={setLoadingExport} />
          )}
          {filename.includes('instrument') && (
            <ExportInstruments setLoading={setLoadingExport} />
          )}
          <Button onClick={handleExport} className="m-2 btn-dark">
            Export Selected Rows
          </Button>
        </span>
      )}
      <DataGrid
        rows={rows}
        columns={cols}
        pagination
        page={initPage}
        pageSize={initLimit}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={handlePageChange}
        loading={loading}
        className=""
        rowsPerPageOptions={[25, 50, 100, rowCount]}
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
