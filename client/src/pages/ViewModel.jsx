/* eslint-disable no-nested-ternary */
import React from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import EditModel from '../components/EditModel';
import InfinityScroll from '../components/InfiniteScroll';
import ModalAlert from '../components/ModalAlert';
import DeleteModel from '../queries/DeleteModel';

export default function DetailedModelView({ onDelete }) {
  DetailedModelView.propTypes = {
    onDelete: PropTypes.func.isRequired,
  };
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let modelNumber = urlParams.get('modelNumber');
  let vendor = urlParams.get('vendor');
  let description = urlParams.get('description');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('');
  const closeModal = () => {
    setShow(false);
  };
  const history = useHistory();
  history.listen((location, action) => {
    let active = true;
    (() => {
      queryString = window.location.search;
      urlParams = new URLSearchParams(queryString);
      if (active && action === 'REPLACE') {
        // edit model updates url wit replace action,
        // so update state
        modelNumber = urlParams.get('modelNumber');
        vendor = urlParams.get('vendor');
        description = urlParams.get('description');
      }
    })();
    return () => {
      active = false;
    };
  });
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      onDelete();
      setTimeout(() => {
        setResponseMsg('');
        if (show) {
          setShow(false);
        }
        if (history.location.state?.previousUrl) {
          let path = history.location.state.previousUrl.split(window.location.host)[1];
          if (path.includes('count')) {
            const count = parseInt(path.substring(path.indexOf('count')).split('count=')[1], 10) - 1;
            path = path.replace(path.substring(path.indexOf('count')), `count=${count}`);
          }
          history.replace( // This code updates the url to have the correct count
            path,
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
      <ModalAlert show={show} handleClose={closeModal} title="Delte Model">
        <>
          {responseMsg.length === 0 && (
            <div className="h4 text-center my-3">{`You are about to delete model ${vendor}:${modelNumber}. Are you sure?`}</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h4">{responseMsg}</div>
            ) : (
              <>
                <div className="mt-3">
                  <button className="btn " type="button" onClick={handleDelete}>
                    Yes
                  </button>
                </div>
                <span className="mx-3" />
                <div className="mt-3">
                  <button className="btn " type="button" onClick={closeModal}>
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
                      calibrationFrequency
                      assetTag
                    }
                  }
                }
              `)}
              queryName="getAllInstrumentsWithModel"
              variables={{ modelNumber, vendor, description }}
              renderItems={(items) => items.map((entry) => (
                <li className="list-group-item" key={entry.id}>
                  <div className="d-flex justify-content-between">
                    <span>
                      Serial #:
                      {' '}
                      {entry.serialNumber}
                    </span>
                    <span>
                      Asset Tag:
                      {' '}
                      {entry.assetTag}
                    </span>
                    <span className="">
                      <button
                        type="button"
                        className="btn "
                        onClick={() => {
                          const state = { previousUrl: window.location.href };
                          history.push(
                            `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&assetTag=${entry.assetTag}&serialNumber=${entry.serialNumber}&description=${description}&id=${entry.id}&calibrationFrequency=${entry.calibrationFrequency}`,
                            state,
                          );
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
