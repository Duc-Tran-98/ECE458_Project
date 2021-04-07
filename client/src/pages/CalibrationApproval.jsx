/* eslint-disable no-param-reassign */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { ServerPaginationGrid } from '../components/UITable';
import UserContext from '../components/UserContext';
import { approvalCols } from '../utils/CalibTable';
import GetCalibHistory from '../queries/GetCalibHistory';
import { StateLessCloseModal } from '../components/ModalAlert';
import InstrumentForm from '../components/InstrumentForm';

export default function CalibrationApprovalPage() {
  // eslint-disable-next-line no-unused-vars
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
  const getCalibrationType = () => {
    if (selectedRow.loadBankData) {
      return 'Load Bank';
    }
    if (selectedRow.klufeData) {
      return 'Klufe';
    }
    if (selectedRow.customFormData) { // TODO: Update this field to match DB name
      return 'Custom';
    }
    return 'Plain';
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
    setSelectedRow(e.row);
    setShow(true);
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
          <>
            <h3 className="px-3 bg-secondary text-light my-auto">
              Instrument Information
            </h3>
            <InstrumentForm
              modelNumber={selectedRow.modelNumber}
              vendor={selectedRow.vendor}
              comment=""
              serialNumber={selectedRow.serialNumber}
              categories={[]}
              viewOnly
              description={selectedRow.description}
              calibrationFrequency={selectedRow.calibrationFrequency}
              assetTag={selectedRow.assetTag}
              hideLongFields
              type="view"
            />
            <h3 className="px-3 bg-secondary text-light mt-3">
              Calibration Information
            </h3>
            <div className="row mx-3 pt-2">
              <div className="col">
                <span className="h5">Calibration Type</span>
                <br />
                <input
                  className="form-control mt-1"
                  disabled
                  value={getCalibrationType()}
                  type="text"
                />
              </div>
              <div className="col">
                <span className="h5">User</span>
                <br />
                <input
                  className="form-control mt-1"
                  disabled
                  value={selectedRow.user}
                  type="text"
                />
              </div>
              <div className="col">
                <span className="h5">Date</span>
                <br />
                <input
                  className="form-control mt-1"
                  disabled
                  value={selectedRow.date}
                  type="text"
                />
              </div>
            </div>
            <div className="row mx-3 mt-3 pt-3 border-top border-dark">
              <div className="col">
                <span className="h5">Comment</span>
                <br />
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  value={selectedRow.comment}
                  disabled
                />
              </div>
              <div className="col">
                <span className="h5">Calibration Data</span>
                <br />
                <Form.Control as="textarea" rows={3} value="TBD" disabled />
              </div>
            </div>
          </>
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
        fetchData={(limit, offset, ordering) => {
          const calibEvents = GetCalibHistory({ id: 1 }).then((data) => {
            data.forEach((element) => {
              element.vendor = 'Fluke';
              element.modelNumber = '458'; // TODO: fill in instrument info for each row
              element.assetTag = 100000;
              element.serialNumber = 'XYZ';
              element.description = 'TEST';
              element.calibrationFrequency = 30;
            });
            return data;
          });
          return calibEvents;
        }}
        rowCount={() => GetCalibHistory({ id: 1 }).then((data) => data.length)}
      />
    </>
  );
}
