/* eslint-disable import/prefer-default-export */
import ExpressQuery from './ExpressQuery';

export function KlufeOn({ handleResponse }) {
  const endpoint = '/api/klufeOn';
  ExpressQuery({
    endpoint,
    method: 'post',
    queryJSON: { },
    handleResponse,
  });
}

export function KlufeOff({ handleResponse }) {
  const endpoint = '/api/klufeOff';
  ExpressQuery({
    endpoint,
    method: 'post',
    queryJSON: { },
    handleResponse,
  });
}

export function KlufeStep({ handleResponse, stepNum, stepStart }) {
  const endpoint = '/api/klufeStep';
  ExpressQuery({
    endpoint,
    method: 'post',
    queryJSON: { stepNum, stepStart },
    handleResponse,
  });
}

export function KlufeStatus({ handleResponse }) {
  const endpoint = '/api/klufeStatus';
  ExpressQuery({
    endpoint,
    method: 'get',
    queryJSON: { },
    handleResponse,
  });
}
