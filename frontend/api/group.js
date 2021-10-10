import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

// self-evident getting the group from group id
export const getGroupByGroupId = (id) => request.get(`/api/group/${id}`)
  // .send(id)
  .then(handleSuccess)
  .catch(handleError);
