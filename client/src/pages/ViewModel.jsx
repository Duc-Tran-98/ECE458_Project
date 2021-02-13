import React from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { Link } from 'react-router-dom';
import EditModel from '../components/EditModel';
import InfinityScroll from '../components/InfiniteScroll';

export default function DetailedModelView() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const modelNumber = urlParams.get('modelNumber');
  const vendor = urlParams.get('vendor');
  const description = urlParams.get('description');
  return (
    <div className="d-flex justify-content-center bg-light">
      <div className="col">
        <div className="row">
          <EditModel
            modelNumber={modelNumber}
            vendor={vendor}
            handleClose={() => undefined}
            viewOnly
          />
        </div>
        <div className="row">
          <div
            id="scrollableDiv"
            style={{
              maxHeight: '45vh',
              overflowY: 'auto',
            }}
          >
            <InfinityScroll
              title="Instances:"
              titleClassName="ps-3 bg-secondary text-light"
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
                      <Link
                        to={`/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&serialNumber=${entry.serialNumber}&description=${description}&id=${entry.id}`}
                      >
                        View Instrument
                      </Link>
                    </span>
                  </div>
                </li>
              ))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
