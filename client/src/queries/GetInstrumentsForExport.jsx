/* eslint-disable no-unused-vars */
import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetInstrumentsForExport({ filterOptions }) {
  GetInstrumentsForExport.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
  };
  const GET_INSTRUMENTS_QUERY = gql`
  query Instruments(
    $vendor: String
    $modelNumber: String
    $description: String
    $serialNumber: String
    $assetTag: Int
    $modelCategories: [String]
    $instrumentCategories: [String]
  ) {
    getInstrumentsWithFilter(
      vendor: $vendor
      modelNumber: $modelNumber
      description: $description
      serialNumber: $serialNumber
      assetTag: $assetTag
      modelCategories: $modelCategories
      instrumentCategories: $instrumentCategories
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
          fileName
          fileLocation
          loadBankData
          klufeData
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
  const query = print(GET_INSTRUMENTS_QUERY);
  const queryName = 'getInstrumentsWithFilter';

  const serialNumber = typeof filterOptions.filterSerialNumber === 'undefined' ? null : filterOptions.filterSerialNumber;
  const vendor = typeof filterOptions.vendors === 'undefined' ? null : filterOptions.vendors;
  const modelNumber = typeof filterOptions.modelNumbers === 'undefined' ? null : filterOptions.modelNumbers;
  const description = typeof filterOptions.descriptions === 'undefined' ? null : filterOptions.descriptions;
  const assetTag = (filterOptions.assetTag === null || typeof filterOptions.assetTag === 'undefined') ? null : filterOptions.assetTag;
  // eslint-disable-next-line prefer-destructuring
  const modelCategories = filterOptions.modelCategories;
  // eslint-disable-next-line prefer-destructuring
  const instrumentCategories = filterOptions.instrumentCategories;

  const getVariables = () => ({
    vendor, modelNumber, description, serialNumber, assetTag, modelCategories, instrumentCategories,
  });
  const response = await QueryAndThen({ query, queryName, getVariables });
  return response;
}

export async function GetAssetTags({ filterOptions }) {
  GetInstrumentsForExport.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
  };
  const GET_INSTRUMENTS_QUERY = gql`
  query Instruments(
    $vendor: String
    $modelNumber: String
    $description: String
    $serialNumber: String
    $assetTag: Int
    $modelCategories: [String]
    $instrumentCategories: [String]
  ) {
    getInstrumentsWithFilter(
      vendor: $vendor
      modelNumber: $modelNumber
      description: $description
      serialNumber: $serialNumber
      assetTag: $assetTag
      modelCategories: $modelCategories
      instrumentCategories: $instrumentCategories
    ) {
      instruments {
        assetTag
      }
    }
  }
  `;
  const query = print(GET_INSTRUMENTS_QUERY);
  const queryName = 'getInstrumentsWithFilter';

  const serialNumber = typeof filterOptions.filterSerialNumber === 'undefined' ? null : filterOptions.filterSerialNumber;
  const vendor = typeof filterOptions.vendors === 'undefined' ? null : filterOptions.vendors;
  const modelNumber = typeof filterOptions.modelNumbers === 'undefined' ? null : filterOptions.modelNumbers;
  const description = typeof filterOptions.descriptions === 'undefined' ? null : filterOptions.descriptions;
  const assetTag = (filterOptions.assetTag === null || typeof filterOptions.assetTag === 'undefined') ? null : filterOptions.assetTag;
  // eslint-disable-next-line prefer-destructuring
  const modelCategories = filterOptions.modelCategories;
  // eslint-disable-next-line prefer-destructuring
  const instrumentCategories = filterOptions.instrumentCategories;

  const getVariables = () => ({
    vendor, modelNumber, description, serialNumber, assetTag, modelCategories, instrumentCategories,
  });
  const response = await QueryAndThen({ query, queryName, getVariables });
  return response;
}
