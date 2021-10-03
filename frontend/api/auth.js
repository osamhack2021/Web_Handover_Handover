import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postRegister = (user) => request.post('/api/auth/register')
  .send(user)
  .then(handleSuccess)
  .catch(handleError);

export const postLogin = (user) => request.post('https://53c78129-9e2a-4ccb-b45b-4b9855417406.mock.pstmn.io/login')
  .send(user)
  .then(handleSuccess)
  .catch(handleError);

export const postLogout = () => request.post('/logout')
  .then(handleSuccess)
  .catch(handleError);
