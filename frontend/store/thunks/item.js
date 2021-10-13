import { snakeToCamelCase } from 'json-style-converter/es5';
import {
  getItemByUserId, updateItem, deleteItem, createItem,
} from '_api/item';
import {
  loadUserItem, updatePermission, deleteUserItem, addUserItem,
} from '_actions/userItem';
import { dispatchError } from '_utils/api';
import { useSelector } from 'react-redux';
import { store as RNC } from 'react-notifications-component';
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
  const userItem = useSelector(R.pick(['userItem']));
  const targetItem = userItem.find((elem) => elem.Id === itemId);

  return updateItem(itemId, { accessGroup: accessGroupObject })
    .then(() => {
      // if the item being managed is also stored in userItem, needs to update store
      if (targetItem) {
        dispatch(updatePermission(userItem.indexOf(targetItem), accessGroupObject));
      }
    });
};

// deleting item
export const attemptDeleteItem = (itemId, targetItem) => (dispatch) => {
  // if stored in userItem, update that as well
  console.log(`attematingDelete Item with ${itemId}`);
  // const userItem = useSelector(R.pick(['userItem']));
  // const targetItem = userItem.find((elem) => elem.Id === itemId);

  return deleteItem(itemId)
    .then(() => {
      // if the item being managed is also stored in userItem, needs to update store
      if (targetItem) {
        dispatch(deleteUserItem(itemId));
      }
      RNC.addNotification({
        title: '삭제 완료',
        type: 'success',
        message: '성공적으로 삭제하였습니다',
        container: 'top-center',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });
    });
};

export const attemptDuplicateItem = (object) => (dispatch) => {
  console.log(`attemptDuplicateItem Item with ${JSON.stringify(object)}`);
  return createItem(object)
    .then((itemObject) => {
      dispatch(addUserItem(snakeToCamelCase(itemObject)));
      RNC.addNotification({
        title: '복제 완료',
        type: 'success',
        message: '성공적으로 복제하였습니다',
        container: 'top-center',
        animationIn: ['animated', 'fadeInRight'],
        animationOut: ['animated', 'fadeOutRight'],
        dismiss: {
          duration: 5000,
        },
      });
    });
};
