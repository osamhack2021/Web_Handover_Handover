import update from 'immutability-helper';
import { LOAD_ALL_USER_ITEM } from '_actions/userItem';

export default function item(state = { cabinet: [], document: [], card: [] }, action) {
  switch (action.type) {
    case LOAD_ALL_USER_ITEM:
      return action.itemArrays;
    default:
      return state;
  }
}
