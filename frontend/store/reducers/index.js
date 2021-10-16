import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import group from './group';
import itemCache from './itemCache';
import todos from './todos';
import user from './user';


const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  user,
  todos,
  group,
  itemCache,
});

export default createRootReducer;
