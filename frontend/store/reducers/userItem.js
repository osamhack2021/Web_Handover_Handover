import update from 'immutability-helper';
import {
  LOAD_ALL_USER_ITEM, UPDATE_PERMISSION, DELETE_USER_ITEM, ADD_USER_ITEM,
} from '_actions/userItem';

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
    case DELETE_USER_ITEM:
      return state.filter((elem) => elem.Id !== action.itemId);
    case ADD_USER_ITEM:
      return [...state, action.itemObject];
    default:
      return state;
  }
}
