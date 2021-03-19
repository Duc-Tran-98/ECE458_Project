/* eslint-disable react/require-default-props */
import * as React from 'react';
import {
  DataGrid, GridOverlay, ColumnsToolbarButton, DensitySelector,
} from '@material-ui/data-grid';
// eslint-disable-next-line no-unused-vars
// import { XGrid } from '@material-ui/x-grid';

import PropTypes from 'prop-types';
import useStateWithCallback from 'use-state-with-callback';
import {
  useState, useRef, useEffect, useContext,
} from 'react';
import { useHistory } from 'react-router-dom';

import { CSVLink } from 'react-csv';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Portal from '@material-ui/core/Portal';
import ExportInstruments from './ExportInstruments';
import ExportModels from './ExportModels';
import UserContext from './UserContext';
import GenerateBarcodes from './GenerateBarcodes';

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
        checkboxSelection={false}
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
        page={state.pagination.page}
        count={state.pagination.pageCount}
        onChange={(event, value) => api.current.setPage(value)}
        siblingCount={2}
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
  headerElement,
  // eslint-disable-next-line no-unused-vars
  filterOptions,
  showToolBar,
  showImport,
}) {
  ServerPaginationGrid.propTypes = {
    fetchData: PropTypes.func.isRequired, // This is what is called to get more data
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired, // This is for displaying columns
    // eslint-disable-next-line react/require-default-props
    cellHandler: PropTypes.func, // callback fired when cell is clicked
    filterRowForCSV: PropTypes.func, // function to filter rows for export
    // eslint-disable-next-line react/forbid-prop-types
    headers: PropTypes.array, // map db keys to CSV headers
    filename: PropTypes.string, // name the csv file
    initPage: PropTypes.number.isRequired, // which page we're on from URL
    initLimit: PropTypes.number.isRequired, // rows/page from URL
    onPageChange: PropTypes.func.isRequired, // callback fired when page changes
    onPageSizeChange: PropTypes.func.isRequired, // callback fired when page size changes or on refresh
    rowCount: PropTypes.func.isRequired, // total number of items
    headerElement: PropTypes.node, // what to display in header beside filter options
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object,
    showToolBar: PropTypes.bool.isRequired,
    showImport: PropTypes.bool.isRequired,
  };
  ServerPaginationGrid.defaultProps = {
    headerElement: null,
    headers: null,
    filename: null,
    filterRowForCSV: null,
    filterOptions: null,
  };
  paginationContainer = React.useRef(null);
  const [rows, setRows] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingExport, setLoadingExport] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const user = useContext(UserContext);
  const history = useHistory();

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
      const val = await rowCount();
      // console.log(val);

      const offset = (initPage - 1) * initLimit;
      const newRows = await fetchData(initLimit, offset);
      if (!active) {
        return;
      }
      setTotal(val);
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
  }, [initLimit, initPage, fetchData]);

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
      const filteredRows = (filterRowForCSV !== null) ? filterRowForCSV(exportRows) : exportRows;
      setCSVData(filteredRows);
    }
  };

  return (
    <div className="rounded" style={{ zIndex: 0 }}>
      <div
        className="rounded"
        style={{
          maxHeight: '72vh',
          overflowY: 'auto',
          width: '100%',
        }}
      >
        {headers && filename && (
          <CSVLink
            data={csvData}
            headers={headers}
            filename={filename}
            className="hidden"
            ref={csvLink}
          />
        )}
        <div className="sticky-top bg-offset rounded" style={{ zIndex: 40 }}>{headerElement}</div>
        <DataGrid
          rows={rows}
          columns={cols}
          pagination
          page={initPage}
          pageSize={initLimit}
          rowCount={total}
          checkboxSelection={filename && filename.includes('instrument')}
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
          onCellClick={(e) => {
            if (cellHandler) {
              cellHandler(e);
            }
          }}
          // onCellHover={() => { document.body.style.cursor = 'pointer'; }}
          autoHeight
          onSelectionChange={(newSelection) => {
            setChecked(newSelection.rowIds);
            const tagArr = [];
            newSelection.rowIds.forEach((rowID) => {
              rows.forEach((row) => {
                // eslint-disable-next-line eqeqeq
                if (row.id == rowID) {
                  tagArr.push(row.assetTag);
                }
              });
            });
            setTags(tagArr);
          }}
          hideFooterSelectedRowCount
          components={{
            Toolbar: () => (
              showToolBar ? (
                <>
                  <ColumnsToolbarButton />
                  <DensitySelector />
                </>
              ) : null
            ),
            LoadingOverlay: CustomLoadingOverlay,
            Pagination: CustomPagination,
          }}
          disableColumnMenu
        />
      </div>
      <div className="row bg-offset rounded py-2 mx-auto">
        <div className="col-auto me-auto" ref={paginationContainer} />
        <div className="col-auto">
          <div className="btn-group dropup">
            <button
              className="btn  dropdown-toggle"
              type="button"
              id="dropdownMenu2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Limit
              {' '}
              {initLimit}
            </button>
            <ul
              className="dropdown-menu bg-light"
              aria-labelledby="dropdownMenu2"
            >
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handlePageSizeChange({ page: initPage, pageSize: 25 })}
                >
                  25
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handlePageSizeChange({ page: initPage, pageSize: 50 })}
                >
                  50
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handlePageSizeChange({ page: initPage, pageSize: 100 })}
                >
                  100
                </button>
              </li>
            </ul>
          </div>
          {user.isAdmin && showImport && (
          <button
            type="button"
            className="btn ms-3"
            onClick={() => {
              history.push('/import');
            }}
          >
            Import
          </button>
          )}
          {handleExport && (
            <>
              {loadingExport && <CircularProgress />}
              {filename && filename.includes('model') && (
              <ExportModels setLoading={setLoadingExport} filterOptions={filterOptions} />
              )}
              {filename && filename.includes('instrument') && (
              <ExportInstruments setLoading={setLoadingExport} filterOptions={filterOptions} />
              )}
              {filename && filename.includes('instrument') && (
                <GenerateBarcodes filterOptions={filterOptions} assetTags={tags} getAll={tags.length === rows.length} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
