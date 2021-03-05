import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function FindInstrument({
  modelNumber, vendor, serialNumber, handleResponse,
}) {
  FindInstrument.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    serialNumber: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const FIND_INSTRUMENT = gql`
        query FindInst(
            $modelNumber: String!
            $vendor: String!
            $serialNumber: String!
        ) {
            getInstrument(
            modelNumber: $modelNumber
            vendor: $vendor
            serialNumber: $serialNumber
            ) {
            calibrationFrequency
            comment
            instrumentCategories{
                name
            }
            }
        }
    `;
  const query = print(FIND_INSTRUMENT);
  const queryName = 'getInstrument';
  const getVariables = () => ({ modelNumber, vendor, serialNumber });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
