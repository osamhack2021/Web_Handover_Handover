import update from 'immutability-helper';
import { LOAD_ALL_USER_ITEM } from '_actions/userItem';

export default function item(state = { cabinet: [], document: [], card: [] }, action) {
  switch (action.type) {
    case LOAD_ALL_USER_ITEM:
      console.log('load all user item');
      console.log(action.itemArrays);
      return action.itemArrays;
    default:
      return state;
  }
}
