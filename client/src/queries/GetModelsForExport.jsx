import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetModelsForExport({ filterOptions }) {
  GetModelsForExport.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
  };
  const GET_MODELS_QUERY = gql`
    query Models {
      getModelsWithFilter{
          models{
          vendor
          modelNumber
          description
          comment
          calibrationFrequency
          categories{
            name
          }
          supportLoadBankCalibration
        }
      }
    }
  `;
  console.log(filterOptions);
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getModelsWithFilter';

  const response = await QueryAndThen({ query, queryName });
  return response;
}
