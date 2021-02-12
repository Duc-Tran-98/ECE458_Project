import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import InstrumentForm from '../components/InstrumentForm';
import { QueryAndThen } from '../components/UseQuery';

export default function DetailedInstrumentView() {
  const query = print(gql`
    query GetInstrument(
      $modelNumber: String!
      $vendor: String!
      $serialNumber: String!
    ) {
      getInstrument(
        modelNumber: $modelNumber
        vendor: $vendor
        serialNumber: $serialNumber
      ) {
        comment
      }
    }
  `);
  const [comment, setComment] = useState('');
  const queryName = 'getInstrument';
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const modelNumber = urlParams.get('modelNumber');
  const vendor = urlParams.get('vendor');
  const serialNumber = urlParams.get('serialNumber');
  const description = urlParams.get('description');
  const getVariables = () => ({ modelNumber, serialNumber, vendor });
  QueryAndThen({ query, queryName, getVariables }).then((data) => {
    setComment(data.comment);
  });
  return (
    <div className="d-flex justify-content-center bg-light">
      <InstrumentForm
        modelNumber={modelNumber}
        vendor={vendor}
        comment={comment}
        serialNumber={serialNumber}
        changeHandler={null}
        validated
        onInputChange={null}
        viewOnly
        description={description}
      />
    </div>
  );
}
