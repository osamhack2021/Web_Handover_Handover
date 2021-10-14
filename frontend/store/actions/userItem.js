export const LOAD_ALL_USER_ITEM = 'LOAD_ALL_USER_ITEM';
export const UPDATE_PERMISSION = 'UPDATE_PERMISSION';
export const DELETE_USER_ITEM = 'DELETE_USER_ITEM';
export const ARCHIVE_USER_ITEM = 'ARCHIVE_USER_ITEM';
export const PUBLISH_USER_ITEM = 'PUBLISH_USER_ITEM';
export const ADD_USER_ITEM = 'ADD_USER_ITEM';

export function loadUserItem(itemArrays) {
  return {
    type: LOAD_ALL_USER_ITEM,
    itemArrays,
  };
}

export function updatePermission(itemId, accessGroupObject) {
  return {
    type: UPDATE_PERMISSION,
    itemId,
    accessGroupObject,
  };
}

export function deleteUserItem(itemId) {
  return {
    type: DELETE_USER_ITEM,
    itemId,
  };
}

export function archiveUserItem(itemId) {
  return {
    type: ARCHIVE_USER_ITEM,
    itemId,
  };
}

export function publishUserItem(itemId) {
  return {
    type: ARCHIVE_USER_ITEM,
    itemId,
  };
}

export function addUserItem(itemObject) {
  return {
    type: ADD_USER_ITEM,
    itemObject,
  };
}
