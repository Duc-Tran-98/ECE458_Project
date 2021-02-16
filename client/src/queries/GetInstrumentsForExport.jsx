import { gql } from '@apollo/client';
import { print } from 'graphql';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetInstrumentsForExport() {
  const GET_INSTRUMENTS_QUERY = gql`
    query instruments {
      getAllInstrumentsWithInfo{
        vendor
          modelNumber
          serialNumber
          comment
          recentCalDate
          recentCalComment
      }
    }
  `;
  const query = print(GET_INSTRUMENTS_QUERY);
  const queryName = 'getAllInstrumentsWithInfo';

  const response = await QueryAndThen({ query, queryName });
  console.log(response);
  return response;
}
