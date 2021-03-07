import axios from 'axios';

const endpoint = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4001/api'
  : '/api';

export default function ExpressQuery({
  route, method, queryJSON, handleResponse,
}) {
  const url = `${endpoint}${route}`;
  axios({
    url,
    method,
    data: queryJSON,
  })
    .then((response) => {
      handleResponse(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
