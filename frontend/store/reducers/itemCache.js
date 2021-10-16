import update from "immutability-helper";
import { ADD_ITEM_CACHE, ADD_ITEM_CACHES, DELETE_ITEM_CACHE } from "_actions/itemCache";

// Read more about update function here: 
// https://reactjs.org/docs/update.html
// Read more about available commands of `update` here:
// https://github.com/kolodny/immutability-helper#available-commands

export default function itemCache(state = {}, action) {
  let index;

  switch (action.type) {
    case ADD_ITEM_CACHES:
      return update(state, {$merge: action.itemCaches});
    case ADD_ITEM_CACHE:
      return update(state, {$merge: action.itemCache});
    // case UPDATE_ITEM_PERMISSION:
    //   index = state.findIndex((item) => item.Id === action.itemId);
    //   return update(state, {
    //     [index]: {
    //       accessGroups: {
    //         $set: action.accessGroups,
    //       },
    //     },
    //   });
    case DELETE_ITEM_CACHE:
      return update(state, {$remove: action.itemId})
    // case ARCHIVE_ITEM:
    //   index = state.findIndex((item) => item.Id === action.itemId);
    //   return update(state, {
    //     [index]: {
    //       status: {
    //         $set: "archived",
    //       },
    //     },
    //   });
    // case PUBLISH_ITEM:
    //   index = state.findIndex((item) => item.Id === action.itemId);
    //   return update(state, {
    //     [index]: {
    //       status: {
    //         $set: "published",
    //       },
    //     },
    //   });
    // case ADD_ITEM:
    //   return [...state, action.itemObject];
    default:
      return state;
  }
}
