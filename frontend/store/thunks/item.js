import { snakeToCamelCase } from 'json-style-converter/es5';
import { getItemByUserId, updateItem } from '_api/item';
import { loadUserItem, updatePermission } from '_actions/userItem';
import { dispatchError } from '_utils/api';
import { useSelector } from 'react-redux';
import R from 'ramda';
// upon success dispatches the user data in camelToSnakeCase.
export const attemptLoadItems = (userId) => (dispatch) => getItemByUserId(userId)
  .then((data) => {
    // set item
    dispatch(loadUserItem(snakeToCamelCase(data)));
    return data;
  })
  .catch(dispatchError(dispatch));

// attemptUpdatePermission:
// parameters: itemId currently being updated, accessGroupObject
export const attemptUpdatePermission = (itemId, accessGroupObject) => (dispatch) => {
  // if stored in userItem, update that as well
  const userItem = useSelector([R.pick('userItem')]);
  const targetItem = userItem.find((elem) => elem.Id === itemId);

  return updateItem(itemId, { accessGroup: accessGroupObject })
    .then(() => {
      // if the item being managed is also stored in userItem, needs to update store
      if (targetItem) {
        dispatch(updatePermission(userItem.indexOf(targetItem), accessGroupObject));
      }
    });
};
