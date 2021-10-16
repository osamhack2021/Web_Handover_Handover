import update from "immutability-helper";
import {
  ADD_ITEM_CACHE,
  ADD_ITEM_CACHES,
  DELETE_ITEM_CACHE
} from "_actions/itemCache";
import { LOGOUT_USER } from "_actions/user";

// Read more about update function here:
// https://reactjs.org/docs/update.html
// Read more about available commands of `update` here:
// https://github.com/kolodny/immutability-helper#available-commands

export default function itemCache(state = {}, action) {
  let index;

  switch (action.type) {
    case ADD_ITEM_CACHES:
      return update(state, { $merge: action.itemCaches });
    case ADD_ITEM_CACHE:
      return update(state, { $merge: action.itemCache });
    case DELETE_ITEM_CACHE:
      return update(state, { $remove: action.itemId });
    case LOGOUT_USER:
      return {};
    default:
      return state;
  }
}
