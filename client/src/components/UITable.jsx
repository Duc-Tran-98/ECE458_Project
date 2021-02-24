/* eslint-disable react/require-default-props */
import * as React from 'react';
import { DataGrid, GridToolbar, GridOverlay } from '@material-ui/data-grid';
// import { GridToolbar, FilterToolbarButton, ColumnsToolbarButton, DensitySelector, } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import useStateWithCallback from 'use-state-with-callback';
import { useState, useRef, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Pagination from '@material-ui/lab/Pagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import Portal from '@material-ui/core/Portal';
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

let paginationContainer;

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

function CustomPagination(props) {
  const { state, api } = props;

  return (
    <Portal container={paginationContainer.current}>
      <Pagination
        color="primary"
        page={state.pagination.page}
        count={state.pagination.pageCount}
        onChange={(event, value) => api.current.setPage(value)}
        siblingCount={3}
      />
    </Portal>
  );
}

CustomPagination.propTypes = {
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    current: PropTypes.object.isRequired,
  }).isRequired,
  /**
   * The GridState object containing the current grid state.
   */
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.object.isRequired,
};

export function ServerPaginationGrid({
  fetchData,
  cols,
  cellHandler,
  filterRowForCSV,
  headers,
  filename,
  initPage,
  initLimit,
  onPageChange,
  onPageSizeChange,
  rowCount,
}) {
  ServerPaginationGrid.propTypes = {
    fetchData: PropTypes.func.isRequired, // This is what is called to get more data
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired, // This is for displaying columns
    // eslint-disable-next-line react/require-default-props
    cellHandler: PropTypes.func,
    filterRowForCSV: PropTypes.func.isRequired, // function to filter rows for export
    // eslint-disable-next-line react/forbid-prop-types
    headers: PropTypes.array.isRequired, // map db keys to CSV headers
    filename: PropTypes.string.isRequired, // name the csv file
    initPage: PropTypes.number.isRequired, // which page we're on from URL
    initLimit: PropTypes.number.isRequired, // rows/page from URL
    onPageChange: PropTypes.func.isRequired, // callback fired when page changes
    onPageSizeChange: PropTypes.func.isRequired, // callback fired when page size changes or on refresh
    rowCount: PropTypes.number.isRequired, // number of items from URL
  };
  paginationContainer = React.useRef(null);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingExport, setLoadingExport] = React.useState(null);

  const handlePageChange = (params) => {
    onPageChange(params.page, initLimit);
  };
  const handlePageSizeChange = (e) => {
    let actualPage = initPage;
    const maxPage = Math.ceil(rowCount / e.pageSize);
    if (e.page > maxPage) { // if you are on page outside page range
      actualPage = maxPage; // change page to max page
    }
    onPageSizeChange(actualPage, e.pageSize);
  };

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const offset = (initPage - 1) * initLimit;
      const newRows = await fetchData(initLimit, offset);
      if (!active) {
        return;
      }
      setRows(newRows);
      if (window.location.href.includes('/viewInstruments')) {
        setTimeout(() => { // lots of data/queries from this route, so
          setLoading(false); // GUI needs more time to update
        }, initLimit * 10);
      } else {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [initLimit, initPage, rowCount]);

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
    <div className="position-relative rounded">
      <div
        className="rounded"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          width: '100%',
        }}
      >
        <CSVLink
          data={csvData}
          headers={headers}
          filename={filename}
          className="hidden"
          ref={csvLink}
        />
        <div className="sticky-top bg-offset rounded">
          {handleExport && (
            <>
              {loadingExport && <LinearProgress color="secondary" />}
              {filename.includes('model') && (
                <ExportModels setLoading={setLoadingExport} />
              )}
              {filename.includes('instrument') && (
                <ExportInstruments setLoading={setLoadingExport} />
              )}
            </>
          )}
          <Button variant="dark" className="m-2">
            Create
            {' '}
            {window.location.href.includes('viewModels')
              ? 'Model'
              : 'Instrument'}
          </Button>
        </div>
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
            LoadingOverlay: CustomLoadingOverlay,
            Pagination: CustomPagination,
          }}
        />
      </div>
      <div
        className="bg-offset position-absolute bottom-0 start-50 translate-middle-x w-100 rounded"
        ref={paginationContainer}
      />
    </div>
  );
}
