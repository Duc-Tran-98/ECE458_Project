import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import PropTypes from 'prop-types';

// export default function DataGridDemo() {
//   const classes = useStyles();

//   return (
//     <div
//       style={{
//         position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'auto', backgroundColor: 'bg-light',
//       }}
//       className={classes.root}
//     >
//       <DataGrid
//         classes={{
//           root: classes.root,
//         }}
//         rows={rows}
//         columns={columns}
//         pageSize={12}
//         checkboxSelection
//         showToolbar
//         locateText={{
//           toolbarDensity: 'Size',
//           toolbarDensityLabel: 'Size',
//           toolbarDensityCompact: 'Small',
//           toolbarDensityStandard: 'Medium',
//           toolbarDensityComfortable: 'Large',
//         }}
//         autoHeight
//         disableSelectionOnClick
//       />
//     </div>
//   );
// }

export default function DisplayGrid({ rows, cols }) {
  DisplayGrid.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cols: PropTypes.array.isRequired,
  };
  return (
    <div>
      <DataGrid
        rows={rows}
        columns={cols}
        pageSize={12}
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
        disableSelectionOnClick
      />
    </div>
  );
}
