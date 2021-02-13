/* eslint-disable react/require-default-props */
import * as React from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default function DisplayGrid({
  rows, cols, cellHandler, handleExport, setChecked,
}) {
  DisplayGrid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired,
    cellHandler: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    handleExport: PropTypes.func,
    setChecked: PropTypes.func,
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
        onSelectionChange={(newSelection) => {
          setChecked(newSelection.rowIds);
        }}
        disableSelectionOnClick
        className="bg-light"
        components={{
          Header: () => (
            <span>
              {handleExport && <Button onClick={handleExport} style={{ position: 'fixed', top: '62px', left: '300px' }} className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall">Export</Button>}
              <GridToolbar />
            </span>
          ),
        }}
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
}) {
  ServerPaginationGrid.propTypes = {
    fetchData: PropTypes.func.isRequired, // This is what is called to get more data
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired, // This is for displaying columns
    // eslint-disable-next-line react/require-default-props
    cellHandler: PropTypes.func,
    getRowCount: PropTypes.func.isRequired,
    shouldUpdate: PropTypes.bool,
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
  return (
    <div style={{ width: '100%', height: '400' }}>
      <DataGrid
        rows={rows}
        columns={cols}
        pagination
        pageSize={limit}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={handlePageChange}
        loading={loading}
        className="bg-light"
        showToolbar
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
      />
    </div>
  );
}
