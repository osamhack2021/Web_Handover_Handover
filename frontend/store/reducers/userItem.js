import update from 'immutability-helper';
import { LOAD_ALL_USER_ITEM, UPDATE_PERMISSION } from '_actions/userItem';

export default function item(state = [], action) {
  switch (action.type) {
    case LOAD_ALL_USER_ITEM:
      return action.itemArrays;
    case UPDATE_PERMISSION:
      return update(state, {
        [action.index]: {
          accessGroups: {
            $set: action.accessGroups,
          },
        },
      });
    default:
      return state;
  }
}
