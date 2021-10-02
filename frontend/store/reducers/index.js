import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import user from './user';
import todos from './todos';
import group from './group';
import userItem from './userItem';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  user,
  todos,
  group,
  userItem,
});

export default createRootReducer;
