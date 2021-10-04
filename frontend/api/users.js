import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postCheckServiceNumber = username =>
  request.post('/api/auth/checkservicenumber')
    .send({ username })
    .then(handleSuccess)
    .catch(handleError);
