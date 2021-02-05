// import { gql } from '@apollo/client';
// import { print } from 'graphql';
// import Query from './UseQuery';

// export default function EditModel({ modelNumber, vendor }) {
//   const FIND_MODEL = gql`
//       query FindModel($modelNumber: String!, $vendor: String!) {
//         findModel(modelNumber: $modelNumber, vendor: $vendor) {
//           vendor
//           modelNumber
//           description
//           comment
//           calibrationFrequency
//         }
//       }
//     `;
//   const query = print(FIND_MODEL);
//   const queryName = 'findModel';
//   const getVariables = () => ({ modelNumber, vendor });
//   const handleResponse = (response) => {
//     console.log(response);
//   };
//   Query({
//     query,
//     queryName,
//     getVariables,
//     handleResponse,
//   });
// }
// // const handleOpen = () => {
// //   const FIND_MODEL = gql`
// //     query FindModel($modelNumber: String!, $vendor: String!) {
// //       findModel(modelNumber: $modelNumber, vendor: $vendor) {
// //         vendor
// //         modelNumber
// //         description
// //         comment
// //         calibrationFrequency
// //       }
// //     }
// //   `;
// //   const query = print(FIND_MODEL);
// //   const queryName = 'findModel';
// //   const getVariables = () => ({ modelNumber, vendor });
// //   const handleResponse = (response) => {
// //     console.log(response);
// //   };
// //   Query({
// //     query,
// //     queryName,
// //     getVariables,
// //     handleResponse,
// //   });
// //   setShow(true);
// // };
