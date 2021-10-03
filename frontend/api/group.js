import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

// self-evident getting the group from group id
export const getGroupByUserId = (id) => request.get('https://53c78129-9e2a-4ccb-b45b-4b9855417406.mock.pstmn.io/group')
  .send(id)
  .then(handleSuccess)
  .catch(handleError);
