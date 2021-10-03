export const LOAD_ALL_USER_ITEM = 'LOAD_ALL_USER_ITEM';

export function loadUserItem(itemArrays) {
  return {
    type: LOAD_ALL_USER_ITEM,
    itemArrays,
  };
}
