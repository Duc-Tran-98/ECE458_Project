/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import * as React from 'react';
import {
  DataGrid,
} from '@material-ui/data-grid';
import {
  GridDensitySelector,
  XGrid,
  GridToolbarContainer,
  GridColumnsToolbarButton,
} from '@material-ui/x-grid';
import $ from 'jquery';

import PropTypes from 'prop-types';
import useStateWithCallback from 'use-state-with-callback';
import {
  useState, useRef, useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';

import { CSVLink } from 'react-csv';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Portal from '@material-ui/core/Portal';
import {
  ImportButton,
} from './CustomMuiIcons';
import ExportModelsIcon from './ExportModelsIcon';
import ExportInstruments, { ExportInstrumentsIcon } from './ExportInstruments';
import ExportModels from './ExportModels';
import CategoriesButton from './CategoriesButton';
import CreateButton from './CreateButton';

// import UserContext from './UserContext';
import { GenerateBarcodesIcon } from './GenerateBarcodes';

export default function DisplayGrid({
  rows, cols, cellHandler,
}) {
  DisplayGrid.propTypes = {
    rows: PropTypes.array.isRequired,
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
    current: PropTypes.object.isRequired,
  }).isRequired,
  /**
   * The GridState object containing the current grid state.
   */
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
  initialOrder,
  onSortModelChange,
  rowCount,
  headerElement,
  filterOptions,
  showToolBar,
  showImport,
  shouldUpdate = false,
  onCreate,
}) {
  ServerPaginationGrid.propTypes = {
    fetchData: PropTypes.func.isRequired, // This is what is called to get more data
    cols: PropTypes.array.isRequired, // This is for displaying columns
    cellHandler: PropTypes.func, // callback fired when cell is clicked
    filterRowForCSV: PropTypes.func, // function to filter rows for export
    headers: PropTypes.array, // map db keys to CSV headers
    filename: PropTypes.string, // name the csv file
    initPage: PropTypes.number.isRequired, // which page we're on from URL
    initLimit: PropTypes.number.isRequired, // rows/page from URL
    onPageChange: PropTypes.func.isRequired, // callback fired when page changes
    onPageSizeChange: PropTypes.func.isRequired, // callback fired when page size changes or on refresh
    initialOrder: PropTypes.array.isRequired,
    onSortModelChange: PropTypes.func.isRequired,
    rowCount: PropTypes.func.isRequired, // total number of items
    headerElement: PropTypes.node, // what to display in header beside filter options
    filterOptions: PropTypes.object,
    showToolBar: PropTypes.bool.isRequired,
    showImport: PropTypes.bool.isRequired,
    shouldUpdate: PropTypes.bool, // if you want to force update table
    onCreate: PropTypes.func, // optional create button
  };
  ServerPaginationGrid.defaultProps = {
    headerElement: null,
    headers: null,
    filename: null,
    filterRowForCSV: null,
    filterOptions: null,
    onCreate: null,
  };
  paginationContainer = React.useRef(null);
  const instrumentTable = filename && filename.includes('instrument');
  const modelTable = filename && filename.includes('model');
  const [rows, setRows] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingExport, setLoadingExport] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const [ordering, setOrdering] = React.useState(initialOrder);
  const history = useHistory();

  const fetchMoreData = async (active) => {
    setLoading(true);
    const val = await rowCount();
    const offset = (initPage - 1) * initLimit;
    const newRows = await fetchData(initLimit, offset, ordering);
    if (!active) {
      return;
    }
    setTotal(val);
    setRows(newRows);
    if (window.location.href.includes('/viewInstruments')) {
      setTimeout(() => { // lots of data/queries from this route, so
        setLoading(false); // GUI needs more time to update
      }, 10);
    } else {
      setLoading(false);
    }
  };

  const handlePageChange = (params) => {
    onPageChange(params.page, initLimit);
  };
  const handleImport = () => {
    history.push('./import');
  };

  const handlePageSizeChange = (params) => {
    let actualPage = initPage;
    const maxPage = Math.ceil(total / params.pageSize);
    if (params.page > maxPage) { // if you are on page outside page range
      actualPage = maxPage; // change page to max page
    }
    onPageSizeChange(actualPage, params.pageSize);
  };

  React.useEffect(() => {
    setTimeout(() => {
      $('.MuiDataGrid-main')
        .find(":contains('Material-UI X Unlicensed product')")
        .first()
        .remove(); // remove watermark
    }, 1);
  }, []);

  const handleSortModelChange = (params) => {
    const orderBy = params.sortModel;
    if (orderBy.length === 0) {
      setOrdering([['id', 'ASC']]);
      onSortModelChange('id', 'ASC');
    } else {
      setOrdering([[orderBy[0].field, orderBy[0].sort.toUpperCase()]]);
      onSortModelChange(orderBy[0].field, orderBy[0].sort.toUpperCase());
    }
  };

  React.useEffect(() => {
    let active = true;

    (async () => {
      fetchMoreData(active);
    })();

    return () => {
      active = false;
    };
  }, [initLimit, initPage, ordering, fetchData]);
  React.useEffect(() => {
    let active = true;

    (async () => {
      if (shouldUpdate) {
        fetchMoreData(active);
      }
    })();

    return () => {
      active = false;
    };
  }, [shouldUpdate]);

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

  const rowsPerPage = total > 100 ? [25, 50, 100, total] : [25, 50, total];

  return (
    <div className="rounded position-relative" style={{ zIndex: 0 }}>
      <div className="position-absolute top-50 start-50 translate-middle">
        {loading && <CircularProgress size="5rem" variant="indeterminate" />}
      </div>
      <div
        className="rounded"
        style={{
          maxHeight: '77vh',
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
        <div className="sticky-top bg-offset rounded" style={{ zIndex: 40 }}>
          {headerElement}
        </div>
        <XGrid
          rows={rows}
          columns={cols}
          rowCount={total}
          pagination
          paginationMode="server"
          page={initPage}
          pageSize={initLimit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          loading={loading}
          rowsPerPageOptions={rowsPerPage}
          hideFooterSelectedRowCount
          autoHeight
          disableColumnMenu
          onCellClick={(e) => {
            if (cellHandler) {
              cellHandler(e);
            }
          }}
          checkboxSelection={filename && filename.includes('instrument')}
          onSelectionModelChange={(newSelection) => {
            setChecked(newSelection.selectionModel);
            const tagArr = [];
            newSelection.selectionModel.forEach((rowID) => {
              rows.forEach((row) => {
                // eslint-disable-next-line eqeqeq
                if (row.id == rowID) {
                  tagArr.push(row.assetTag);
                }
              });
            });
            setTags(tagArr);
          }}
          components={{
            Pagination: CustomPagination,
            Toolbar: () => (
              <>
                {showToolBar
          && (
          <GridToolbarContainer className="row">
            <div className="col-auto me-auto">
              {showImport && (
              <>
                <CreateButton type={filename} onCreate={onCreate} />
                <ImportButton onClick={handleImport} />
              </>
              )}
              <CategoriesButton type={filename} />
              {handleExport && (
              <>
                {/* {loadingExport && <CircularProgress />}
                {modelTable && (
                <ExportModelsIcon
                  setLoading={setLoadingExport}
                  filterOptions={filterOptions}
                />
                )}
                {instrumentTable && (
                <ExportInstrumentsIcon
                  setLoading={setLoadingExport}
                  filterOptions={filterOptions}
                />
                )} */}
                {instrumentTable && (
                <GenerateBarcodesIcon
                  filterOptions={filterOptions}
                  assetTags={tags}
                  getAll={tags.length === rows.length}
                />
                )}
              </>
              )}

            </div>
            <div className="col-auto">
              <GridDensitySelector />
              <GridColumnsToolbarButton />
            </div>

          </GridToolbarContainer>
          )}
              </>
            ),
            LoadingOverlay: () => null,
          }}
        />
      </div>
      <div className="row bg-offset rounded py-2 mx-auto">
        {/* This is where the footer starts */}
        <div className="col-auto me-auto" ref={paginationContainer} />
        {/* This is container for the custom pagination */}
        <div className="col-auto">
          {handleExport && (
            <>
              {loadingExport && <CircularProgress />}
              {filename && filename.includes('model') && (
                <ExportModels
                  setLoading={setLoadingExport}
                  filterOptions={filterOptions}
                />
              )}
              {filename && filename.includes('instrument') && (
                <ExportInstruments
                  setLoading={setLoadingExport}
                  filterOptions={filterOptions}
                />
              )}
              <span className="ms-3" />
            </>
          )}
          <div className="btn-group dropup">
            {/* This is for the drop up of how many user can select */}
            <button
              className="btn  dropdown-toggle"
              type="button"
              id="dropdownMenu2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Limit
              {' '}
              {initLimit === total ? 'All' : initLimit}
            </button>
            <ul
              className="dropdown-menu bg-light"
              aria-labelledby="dropdownMenu2"
            >
              {rowsPerPage.map((el) => (
                <li key={el}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handlePageSizeChange({ page: initPage, pageSize: el })}
                  >
                    {el === total ? 'All' : el}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
