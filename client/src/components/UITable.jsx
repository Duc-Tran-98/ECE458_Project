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
  return (
    <div>
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
        // onSelectionChange={(newSelection) => {
        //   console.log(newSelection);
        // }}
        onCellClick={(e) => {
          // console.log(e);
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
