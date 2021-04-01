/* eslint-disable react/require-default-props */
import * as React from 'react';
import {
  DataGrid,
} from '@material-ui/data-grid';

import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import Portal from '@material-ui/core/Portal';

export default function SimpleGrid({
  rows, cols, cellHandler,
}) {
  SimpleGrid.propTypes = {
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
        disableColumnMenu
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
    // eslint-disable-next-line react/forbid-prop-types
    current: PropTypes.object.isRequired,
  }).isRequired,
  /**
   * The GridState object containing the current grid state.
   */
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.object.isRequired,
};
