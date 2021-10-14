import update from 'immutability-helper';
import { ADD_USER_ITEM, ARCHIVE_USER_ITEM, DELETE_USER_ITEM, LOAD_ALL_USER_ITEM, PUBLISH_USER_ITEM, UPDATE_PERMISSION } from '_actions/userItem';

export default function item(state = [], action) {
  let index;

  switch (action.type) {
    case LOAD_ALL_USER_ITEM:
      return action.itemArrays;
    case UPDATE_PERMISSION:
      index = state.findIndex(item => item.Id === action.itemId)
      return update(state, {
        [index]: {
          accessGroups: {
            $set: action.accessGroups,
          },
        },
      });
    case DELETE_USER_ITEM:
      return state.filter((elem) => elem.Id !== action.itemId);
    case ARCHIVE_USER_ITEM:
      index = state.findIndex(item => item.Id === action.itemId)
      return update(state, {
        [index]: {
          status: {
            $set: 'archived',
          },
        },
      });
    case PUBLISH_USER_ITEM:
      index = state.findIndex(item => item.Id === action.itemId)
      return update(state, {
        [index]: {
          status: {
            $set: 'published',
          },
        },
      });
    case ADD_USER_ITEM:
      return [...state, action.itemObject];
    default:
      return state;
  }
}
