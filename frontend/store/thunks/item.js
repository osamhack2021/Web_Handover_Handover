import { snakeToCamelCase } from "json-style-converter/es5";
import R from "ramda";
import { store as RNC } from "react-notifications-component";
import { useSelector } from "react-redux";
import {
  addUserItem, archiveUserItem, deleteUserItem, loadUserItem, publishUserItem, updatePermission
} from "_actions/userItem";
import { archiveItem, createItem, deleteItem, getItemByUserId, publishItem, updateItem } from "_api/item";
import { dispatchError } from "_utils/api";

// upon success dispatches the user data in camelToSnakeCase.
export const attemptLoadItems = (userId) => (dispatch) =>
  getItemByUserId(userId)
    .then((data) => {
      // set item
      dispatch(loadUserItem(snakeToCamelCase(data)));
      return data;
    })
    .catch(dispatchError(dispatch));

// attemptUpdatePermission:
// parameters: itemId currently being updated, accessGroupObject
export const attemptUpdatePermission =
  (itemId, accessGroupObject) => (dispatch) => {
    const userItem = useSelector(R.pick(["userItem"]));

    return updateItem(itemId, { accessGroup: accessGroupObject }).then(() => {
      // if the item being managed is also stored in userItem, needs to update store
      dispatch(updatePermission(itemId, accessGroupObject));
    });
  };

// deleting item
export const attemptDeleteItem = (itemId) => (dispatch) => {
  return deleteItem(itemId).then(() => {
    // remove locally stored item
    dispatch(deleteUserItem(itemId));

    RNC.addNotification({
      title: "삭제 완료",
      type: "success",
      message: "성공적으로 삭제하였습니다",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  });
};

// archive item
export const attemptArchiveItem = (itemId) => (dispatch) => {
  return archiveItem(itemId).then(() => {
    // remove locally stored item
    dispatch(archiveUserItem(itemId));

    RNC.addNotification({
      title: "보관 완료",
      type: "success",
      message: "항목을 보관하였습니다",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  });
};

// unarchive item
export const attemptPublishItem = (itemId) => (dispatch) => {
  return publishItem(itemId).then(() => {
    // remove locally stored item
    dispatch(publishUserItem(itemId));

    RNC.addNotification({
      title: "게시 완료",
      type: "success",
      message: "항목을 게시하였습니다",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  });
};

export const attemptDuplicateItem = (object) => (dispatch) => {
  console.log(`attemptDuplicateItem Item with ${JSON.stringify(object)}`);
  return createItem(object).then((itemObject) => {
    dispatch(addUserItem(snakeToCamelCase(itemObject)));
    RNC.addNotification({
      title: "복제 완료",
      type: "success",
      message: "성공적으로 복제하였습니다",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  });
};
