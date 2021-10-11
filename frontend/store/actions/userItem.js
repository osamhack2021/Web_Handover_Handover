export const LOAD_ALL_USER_ITEM = 'LOAD_ALL_USER_ITEM';
export const UPDATE_PERMISSION = 'UPDATE_PERMISSION';
export const DELETE_USER_ITEM = 'DELETE_USER_ITEM';

export function loadUserItem(itemArrays) {
  return {
    type: LOAD_ALL_USER_ITEM,
    itemArrays,
  };
}

export function updatePermission(index, accessGroupObject) {
  return {
    type: UPDATE_PERMISSION,
    index,
    accessGroupObject,
  };
}

export function deleteUserItem(itemId) {
  return {
    type: DELETE_USER_ITEM,
    itemId,
  };
}
