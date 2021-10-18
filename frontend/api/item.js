import request from 'superagent';
import { handleError, handleSuccess } from '_utils/api';

// get item with item id
export const getItem = (itemId) => request.get(`/api/item/${itemId}`)
  .then(handleSuccess)
  .catch(handleError);

// get all items from user with user id
// all item's owner property would be same current as user's id
export const getUserItem = (userId) => request.get('/api/item/')
  .query({ owner: userId })
  .then(handleSuccess)
  .catch(handleError);

// get item's children if exists
// searches with ?path={itemPath} query
export const getItemChildren = (itemPath) => request.get('/api/item')
  .query({ path: itemPath })
  .then(handleSuccess)
  .catch(handleError);

// get recommended items with user id
export const getRecommendItem = (userId) => request.get('/api/recommend')
  .query({ userId: userId })
  .then(handleSuccess)
  .catch(handleError);

// get Algolia search result
export const algoliaSearch = (query) => request.get(`/api/item/algolia/${query}`)
  // .query({ query })
  .then(handleSuccess)
  .catch(handleError);

// update item with item id
export const updateItem = (itemId, object) => request.put(`/api/item/${itemId}`)
  .send(object)
  .then(handleSuccess)
  .catch(handleError);

// update item with item id
export const addItemComment = (itemId, comments) => request.put(`/api/item/${itemId}`)
  .send({comments: comments})
  .then(handleSuccess)
  .catch(handleError);

// update item.status to 'archived' with item id
export const archiveItem = (itemId) => request.put(`/api/item/${itemId}`)
  .send({status: 'archived'})
  .then(handleSuccess)
  .catch(handleError);

// update item.status to 'published' with item id
export const publishItem = (itemId) => request.put(`/api/item/${itemId}`)
  .send({status: 'published'})
  .then(handleSuccess)
  .catch(handleError);

// delete item with item id
export const deleteItem = (itemId) => request.delete(`/api/item/${itemId}`)
  .then(handleSuccess)
  .catch(handleError);

// create item with object
export const createItem = (object) => request.post('/api/item')
  .send(object)
  .then(handleSuccess)
  .catch(handleError);
