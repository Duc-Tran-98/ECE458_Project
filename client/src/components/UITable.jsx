import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import PropTypes from 'prop-types';

export default function DisplayGrid({ rows, cols, cellHandler }) {
  DisplayGrid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired,
    // eslint-disable-next-line react/require-default-props
    cellHandler: PropTypes.func,
  };

  console.log('rows: ');
  console.log(`${rows}`);
  console.log('cols: ');
  console.log(`${cols}`);

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
  const limit = 10; // Can make this bigger if you want; configs how many rows to display/page
  const [page, setPage] = React.useState(1);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(null);
  const handlePageChange = (params) => {
    setPage(params.page);
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
        autoHeight
      />
    </div>
  );
}
