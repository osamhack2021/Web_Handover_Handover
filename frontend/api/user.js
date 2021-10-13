import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const getUser = (userId) => request.get(`/api/user/${userId}`)
  .then(handleSuccess)
  .catch(handleError);

export const putUser = (userId, info) => request.put(`/api/user/${userId}`)
  .send(info)
  .then(handleSuccess)
  .catch(handleError);

export const putUserPassword = (passwordInfo) => request.put('/api/user/password')
  .send(passwordInfo)
  .then(handleSuccess)
  .catch(handleError);

export const searchUserByGroupId = (groupId) => request.get(`/api/user`)
  .query({ group: groupId })
  .then(handleSuccess)
  .catch(handleError);