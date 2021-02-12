/* eslint-disable react/require-default-props */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
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

  const exportButton = () => (
    <Button onClick={handleExport}>Export</Button>
  );

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
        // TODO: Only render when exportButton exists
        components={{
          Header: exportButton,
        }}
      />
    </div>
  );
}
