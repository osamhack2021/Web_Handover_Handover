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
// Updates item permission by granting groupId(param)
// permission to read(bool), edit(bool) item(specified by itemId)
export const attemptUpdatePermission = (itemId, groupId, read, edit) => (dispatch) => {
  const group = useSelector([R.pick('group')]);
  const targetItem = group.find((elem) => elem.Id === itemId);
  const newAccessGroupObject = targetItem.accessGroup;
  if (read) {
    newAccessGroupObject.read.push(groupId);
  }
  if (edit) {
    newAccessGroupObject.edit.push(groupId);
  }

  return updateItem(itemId, { accessGroup: newAccessGroupObject })
    .then(() => {
      if (targetItem) {
        dispatch(updatePermission(group.indexOf(targetItem), newAccessGroupObject));
      }
    });
};
