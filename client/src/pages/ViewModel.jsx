/* eslint-disable no-nested-ternary */
import React from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditModel from '../components/EditModel';
import InfinityScroll from '../components/InfiniteScroll';
import ModalAlert from '../components/ModalAlert';
import DeleteModel from '../queries/DeleteModel';

export default function DetailedModelView() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const modelNumber = urlParams.get('modelNumber');
  const vendor = urlParams.get('vendor');
  const description = urlParams.get('description');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('');
  const closeModal = () => {
    setShow(false);
  };
  const history = useHistory();
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      setTimeout(() => {
        setResponseMsg('');
        if (show) {
          setShow(false);
        }
        if (history.location.state.previousUrl) {
          // console.log(history.location.state.previousUrl.split(window.location.host));
          history.replace(
            history.location.state.previousUrl.split(window.location.host)[1],
            null,
          );
        } else {
          history.replace('/', null);
        }
      }, 1000);
    }
  };
  const handleDelete = () => {
    setLoading(true);
    DeleteModel({ modelNumber, vendor, handleResponse });
  };
  return (
    <>
      <ModalAlert show={show} handleClose={closeModal} title="DELETE MODEL">
        <>
          {responseMsg.length === 0 && (
            <div className="h4 text-center my-3">{`You are about to delete ${vendor}:${modelNumber}. Are you sure?`}</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h4">{responseMsg}</div>
            ) : (
              <>
                <div className="mx-5 mt-3">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={handleDelete}
                  >
                    Yes
                  </button>
                </div>
                <div className="mx-5 mt-3">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={closeModal}
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      </ModalAlert>
      <div className="col">
        <div className="row">
          <EditModel
            initModelNumber={modelNumber}
            initVendor={vendor}
            handleDelete={() => setShow(true)}
          />
        </div>
        <div className="row px-3">
          <div
            id="scrollableDiv"
            style={{
              maxHeight: '45vh',
              overflowY: 'auto',
            }}
          >
            <InfinityScroll
              title="Instances:"
              titleClassName="px-3 bg-secondary text-light sticky-top"
              query={print(gql`
                query GetInstrumentFromModel(
                  $modelNumber: String!
                  $vendor: String!
                  $limit: Int
                  $offset: Int
                ) {
                  getAllInstrumentsWithModel(
                    modelNumber: $modelNumber
                    vendor: $vendor
                    limit: $limit
                    offset: $offset
                  ) {
                    total
                    rows {
                      serialNumber
                      id
                    }
                  }
                }
              `)}
              queryName="getAllInstrumentsWithModel"
              variables={{ modelNumber, vendor }}
              renderItems={(items) => items.map((entry) => (
                <li className="list-group-item" key={entry.id}>
                  <div className="d-flex justify-content-between">
                    <span>
                      Serial #
                      {entry.serialNumber}
                    </span>
                    <span className="">
                      <button
                        type="button"
                        className="btn btn-dark"
                        onClick={() => {
                          const state = { previousUrl: window.location.href };
                          history.push(`/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&serialNumber=${entry.serialNumber}&description=${description}&id=${entry.id}`, state);
                        }}
                      >
                        View Instrument
                      </button>
                    </span>
                  </div>
                </li>
              ))}
            />
          </div>
        </div>
      </div>
    </>
  );
}
/*
TODO: Clear state instead of reload page
*/
