import { gql } from '@apollo/client';
import { print } from 'graphql';
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
        query FindInst(
            $assetTag: Int!
        ) {
            getInstrumentByAssetTag(
              assetTag: $assetTag
            ) {
              modelNumber
              vendor
              serialNumber
              assetTag
              calibrationFrequency
              comment
              instrumentCategories{
                  name
              }
            }
        }
    `;
  const query = print(FIND_INSTRUMENT);
  const queryName = 'getInstrumentByAssetTag';
  const getVariables = () => ({ assetTag });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
