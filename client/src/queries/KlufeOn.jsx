import ExpressQuery from './ExpressQuery';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4001'
  : '/express';

export default function KlufeOn({ handleResponse }) {
  const endpoint = `${route}/klufeOn`;
  ExpressQuery({
    endpoint,
    method: 'post',
    queryJSON: { },
    handleResponse,
  });
}
