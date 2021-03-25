/* eslint-disable react/forbid-prop-types */
import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function GetAllInstruments({
  handleResponse,
  limit,
  offset,
  vendor,
  modelNumber,
  description,
  modelCategories,
  instrumentCategories,
  serialNumber,
  assetTag,
  orderBy,
}) {
  GetAllInstruments.propTypes = {
    handleResponse: PropTypes.func,
    limit: PropTypes.number,
    offset: PropTypes.number,
    vendor: PropTypes.string,
    modelNumber: PropTypes.string,
    description: PropTypes.string,
    modelCategories: PropTypes.array,
    instrumentCategories: PropTypes.array,
    serialNumber: PropTypes.string,
    assetTag: PropTypes.number,
    orderBy: PropTypes.array,
  };
  const GET_INSTRUMENTS_QUERY = gql`
    query Instruments(
      $limit: Int
      $offset: Int
      $vendor: String
      $modelNumber: String
      $description: String
      $serialNumber: String
      $assetTag: Int
      $modelCategories: [String]
      $instrumentCategories: [String]
      $orderBy: [[String]]
    ) {
      getInstrumentsWithFilter(
        limit: $limit
        offset: $offset
        vendor: $vendor
        modelNumber: $modelNumber
        description: $description
        serialNumber: $serialNumber
        assetTag: $assetTag
        modelCategories: $modelCategories
        instrumentCategories: $instrumentCategories
        orderBy: $orderBy
      ) {
        instruments {
          id
          vendor
          modelNumber
          assetTag
          serialNumber
          description
          calibrationFrequency
          comment
          recentCalibration {
            user
            date
            comment
          }
          modelCategories {
            name
          }
          instrumentCategories {
            name
          }
        }
        total
      }
    }
  `;
  const queryName = 'getInstrumentsWithFilter';
  const query = print(GET_INSTRUMENTS_QUERY);
  const getVariables = () => ({
    limit, offset, vendor, modelNumber, description, serialNumber, assetTag, modelCategories, instrumentCategories, orderBy,
  });
  if (handleResponse) {
    Query({
      query,
      queryName,
      handleResponse,
      getVariables,
    });
  } else {
    // eslint-disable-next-line no-return-await
    const response = await QueryAndThen({ query, queryName, getVariables });
    return response;
  }
}

export async function CountInstruments() {
  const query = print(gql`
    query Count{
      countAllInstruments
    }
  `);
  const queryName = 'countAllInstruments';
  const response = await QueryAndThen({ query, queryName });
  return response;
}
