export const LOAD_ALL_USER_ITEM = 'LOAD_ALL_USER_ITEM';
export const UPDATE_PERMISSION = 'UPDATE_PERMISSION';

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
