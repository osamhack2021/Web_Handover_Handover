export const ADD_ITEM_CACHES = "ADD_ITEM_CACHES";
export const ADD_ITEM_CACHE = "ADD_ITEM_CACHE";
// export const GET_USER_ITEM = 'GET_USER_ITEM';
// export const GET_ITEM = 'GET_ITEM';
// export const UPDATE_ITEM_PERMISSION = 'UPDATE_ITEM_PERMISSION';
export const DELETE_ITEM_CACHE = "DELETE_ITEM_CACHE";
// export const ARCHIVE_ITEM = 'ARCHIVE_ITEM';
// export const PUBLISH_ITEM = 'PUBLISH_ITEM';
// export const ADD_ITEM = 'ADD_ITEM';

export function addItemCaches(items) {
  let itemCaches = {};

  console.log("addItemCaches; items = " + items);

  // creates following object
  // itemCaches = {
  //   "616931551e98fb567a4ecd08": {
  //     "_id": "616931551e98fb567a4ecd08",
  //     'title': "Lorem ipsum",
  //     ...
  //   },
  //   ...
  // }
  items.forEach((e) => (itemCaches[e._id] = e));

  return {
    type: ADD_ITEM_CACHES,
    itemCaches,
  };
}

export function addItemCache(item) {
  // creates following object
  // itemCache = {
  //   "616931551e98fb567a4ecd08": {
  //     "_id": "616931551e98fb567a4ecd08",
  //     'title': "Lorem ipsum",
  //     ...
  //   }
  // }
  return {
    type: ADD_ITEM_CACHE,
    itemCache: { [item._id]: item },
  };
}

// export function updateItemPermission(item) {
//   return {
//     type: UPDATE_ITEM_PERMISSION,
//     item,
//   };
// }

export function deleteItemCache(itemId) {
  return {
    type: DELETE_ITEM_CACHE,
    itemId,
  };
}

// export function archiveItem(itemId) {
//   return {
//     type: ARCHIVE_ITEM,
//     itemId,
//   };
// }

// export function publishItem(itemId) {
//   return {
//     type: ARCHIVE_ITEM,
//     itemId,
//   };
// }

// export function addItem(itemObject) {
//   return {
//     type: ADD_ITEM,
//     itemObject,
//   };
// }
