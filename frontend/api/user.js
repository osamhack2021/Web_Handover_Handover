import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const getUser = (userId) => request.get(`/api/user/${userId}`)
  .then(handleSuccess)
  .catch(handleError);

export const putUser = (info) => request.put('/api/user')
  .send(info)
  .then(handleSuccess)
  .catch(handleError);

export const putUserPassword = (passwordInfo) => request.put('/api/user/password')
  .send(passwordInfo)
  .then(handleSuccess)
  .catch(handleError);
