import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

// from userID, get all the items the user created
export const getItemByUserId = (id) => request.get('https://53c78129-9e2a-4ccb-b45b-4b9855417406.mock.pstmn.io/item/')
  .query({ userId: 1 })
  .then(handleSuccess)
  .catch(handleError);

export const getItemByItemId = (id) => request.get('https://53c78129-9e2a-4ccb-b45b-4b9855417406.mock.pstmn.io/item/')
  .query({ itemId: id })
  .then(handleSuccess)
  .catch(handleError);

export const getRecommendItem = (id) => request.get('https://53c78129-9e2a-4ccb-b45b-4b9855417406.mock.pstmn.io/recommend')
  .query({ userId: id })
  .then(handleSuccess)
  .catch(handleError);
