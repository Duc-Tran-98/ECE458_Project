import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import Query, { QueryAndThen } from '../components/UseQuery';

export default function FindInstrument({
  assetTag, handleResponse,
}) {
  FindInstrument.propTypes = {
    // modelNumber: PropTypes.string.isRequired,
    // vendor: PropTypes.string.isRequired,
    // serialNumber: PropTypes.string.isRequired,
    assetTag: PropTypes.number.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const FIND_INSTRUMENT = gql`
    query FindInst($assetTag: Int!) {
      getInstrumentByAssetTag(assetTag: $assetTag) {
        modelNumber
        vendor
        serialNumber
        assetTag
        calibrationFrequency
        comment
        description
        id
        requiresCalibrationApproval
        instrumentCategories {
          name
        }
      }
    }
  `;
  const query = FIND_INSTRUMENT;
  const queryName = 'getInstrumentByAssetTag';
  const getVariables = () => ({ assetTag });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}

export function FindInstrumentById({ id, handleResponse }) {
  FindInstrumentById.propTypes = {
    id: PropTypes.number.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const FIND_INSTRUMENT = gql`
    query FindInst($id: Int!) {
      getInstrumentById(id: $id) {
        modelNumber
        vendor
        serialNumber
        assetTag
        calibrationFrequency
        comment
        requiresCalibrationApproval
        id
        description
        instrumentCategories {
          name
        }
      }
    }
  `;
  const query = FIND_INSTRUMENT;
  const queryName = 'getInstrumentById';
  const getVariables = () => ({ id });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}
