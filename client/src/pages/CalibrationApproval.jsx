/* eslint-disable no-param-reassign */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import UserContext from '../components/UserContext';
import { approvalCols } from '../utils/CalibTable';
// import GetCalibHistory from '../queries/GetCalibHistory';
import { StateLessCloseModal } from '../components/ModalAlert';
import DetailedCalibrationView from '../components/DetailedCalibrationView';
import GetAllPendingCalibEvents from '../queries/GetAllPendingCalibEvents';

export default function CalibrationApprovalPage() {
  const user = React.useContext(UserContext);
  const history = useHistory();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
  const [orderBy, setOrderBy] = React.useState(urlParams.get('orderBy'));
  const [sortBy, setSortBy] = React.useState(urlParams.get('sortBy'));
  const [show, setShow] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null); // the state we need to display in the modal
  // eslint-disable-next-line no-unused-vars
  const [update, setUpdate] = React.useState(false);
  const getAndSetUrlVals = (search = null) => {
    const urlVals = new URLSearchParams(search || window.location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    const order = urlVals.get('orderBy');
    const sort = urlVals.get('sortBy');
    setInitLimit(lim);
    setInitPage(pg);
    setOrderBy(order);
    setSortBy(sort);
  };
  const updateUrlOnPageChange = (page, limit) => {
    // this is passed to the on page change and on page size change
    // handlers of the server pagination grid
    const searchString = `?page=${page}&limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}`;
    if (window.location.search !== searchString) {
      // If current location != next location, update url
      history.push(`/viewModels${searchString}`);
    }
  };

  const updateUrlOnOrderChange = (order, sort) => {
    // this is passed to the on page change and on page size change
    // handlers of the server pagination grid
    const searchString = `?page=${initPage}&limit=${initLimit}&orderBy=${order}&sortBy=${sort}`;
    if (window.location.search !== searchString) {
      // If current location != next location, update url
      history.push(`/viewModels${searchString}`);
    }
  };
  React.useEffect(() => {
    history.listen((location) => {
      let active = true;
      (async () => {
        if (!active) return;
        getAndSetUrlVals(location.search); // if history.push/replace or pop happens, update our state
        // based on the search params
      })();
      return () => {
        active = false;
      };
    });
  }, []);
  const cellHandler = (e) => {
    if (!(e.field === 'fileName' && e.row.fileName)) { // if click on fileName field and fileName has a value, don't setShow to true because that's a link
      setSelectedRow(e.row);
      setShow(true);
    }
  };
  return (
    <>
      <StateLessCloseModal
        show={show}
        handleClose={() => setShow(false)}
        title="Approval Request"
        size="xl"
      >
        {selectedRow && (
          <DetailedCalibrationView
            selectedRow={selectedRow}
            approverId={user.id}
            onBtnClick={() => setShow(false)}
          />
        )}
      </StateLessCloseModal>
      <ServerPaginationGrid
        shouldUpdate={update}
        cols={approvalCols}
        initPage={initPage || 1}
        initLimit={initLimit || 25}
        cellHandler={(e) => cellHandler(e)}
        onPageChange={(page, limit) => {
          updateUrlOnPageChange(page, limit);
        }}
        onPageSizeChange={(page, limit) => {
          updateUrlOnPageChange(page, limit);
        }}
        initialOrder={orderBy ? [[orderBy, sortBy]] : []}
        onSortModelChange={(order, sort) => {
          updateUrlOnOrderChange(order, sort);
        }}
        showToolBar={false}
        showImport={false}
        headerElement={
          <div className="ps-3 h5 py-2">Calibration Approval Table</div>
        }
        // eslint-disable-next-line no-unused-vars
        fetchData={(limit, offset, ordering) => GetAllPendingCalibEvents({
          limit,
          offset,
          fetchPolicy: 'no-cache',
        }).then((data) => data)}
        rowCount={() => GetAllPendingCalibEvents({
          fetchPolicy: 'no-cache',
          limit: 1,
          offset: 0,
        }).then((data) => data.length)}
      />
    </>
  );
}
