import axios from 'axios';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4001'
  : '/express';

export default function ExpressQuery({
  endpoint, method, queryJSON, handleResponse,
}) {
  const url = `${route}${endpoint}`;
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
