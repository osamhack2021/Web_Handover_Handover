import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postRegister = user =>
  request.post('/api/user')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogin = user =>
  request.post('/api/login')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogout = () =>
  request.post('/api/logout')
    .then(handleSuccess)
    .catch(handleError);
