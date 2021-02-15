import { gql } from '@apollo/client';
import { print } from 'graphql';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetInstrumentsForExport() {
  const GET_INSTRUMENTS_QUERY = gql`
    query Instruments {
      getAllInstruments{
        vendor
        modelNumber
        serialNumber
        comment
        date
        calibrationComment
      }
    }
  `;
  const query = print(GET_INSTRUMENTS_QUERY);
  const queryName = 'getAllInstruments';

  const response = await QueryAndThen({ query, queryName });
  return response;
}
