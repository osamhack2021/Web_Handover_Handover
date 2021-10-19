import { store as RNC } from "react-notifications-component";
import {
  addItemCache,
  addItemCaches,
  deleteItemCache
} from "_actions/itemCache";
import {
  addItemComment,
  archiveItem,
  createItem,
  deleteItem,
  getItem,
  getItemChildren,
  getUserItem,
  publishItem,
  updateItem
} from "_api/item";
import { dispatchError } from "_utils/api";

// upon success dispatches the user data in camelToSnakeCase.
export const attemptGetUserItem = (userId) => (dispatch) =>
  getUserItem(userId)
    .then((items) => {
      // save all results to itemCache
      dispatch(addItemCaches(items));
      return items;
    })
    .catch(dispatchError(dispatch));

export const attemptGetItem = (itemId) => (dispatch) =>
  getItem(itemId)
    .then((item) => {
      // save all result to itemCache
      dispatch(addItemCache(item));
      return item;
    })
    .catch(dispatchError(dispatch));

// Below is an attempt to combine cache checking and retrieving into one code.
// But since the store is only accessible within React context, the itemCache
// has to be passed as a parameter.
//
// This is not a good practice, and resolving a promise multiple time won't call
// .then(...) multiple times. Read more about multiple resolves in Promise here:
// https://stackoverflow.com/a/29491617/4524257
//
// So instead, check for the cache in the calling React component (e.g., Item, ItemPage)
// and call attemptGetItem to get values from the server. And check whether there
// are any changes, and re-render and update the cache if updated.

// export const attemptGetItem = (itemId, itemCache) => {
//   return (dispatch) => {
//     // wrapper promise over potential API call
//     return new Promise((resolve, reject) => {
//       const cachedItem = itemCache.hasOwnProperty(itemId)
//         ? itemCache[itemId]
//         : null;
//       console.log("attemptGetItem: cachedItem = ", cachedItem);

//       if (cachedItem != null) {
//         // item was found in cache
//         // return cached item object to callback
//         resolve(cacheditem);

//         // retrieve item from server to get the latest results
//         getItem(itemId)
//           .then((item) => {
//             // save all result to itemCache
//             resolve(item);
//             dispatch(addItemCache(item));
//           })
//           .catch(dispatchError(dispatch));
//       } else {
//         // item wasn't found in cache

//         // retrieve item from server to get the latest results
//         getItem(itemId)
//           .then((item) => {
//             // save all result to itemCache
//             resolve(item);
//             dispatch(addItemCache(item));
//           })
//           .catch(error => {
//             reject(error)
//             return dispatchError(dispatch);
//           });
//       }
//     });
//   };
// };

export const attemptGetItemChildren = (itemPath) => (dispatch) =>
  getItemChildren(itemPath)
    .then((items) => {
      // save all result to itemCache
      dispatch(addItemCaches(items));
      return items;
    })
    .catch(dispatchError(dispatch));

export const attemptCreateItem = (item) => (dispatch) => {
  // Exclude _id property from item object
  // Read more: https://stackoverflow.com/a/56773391/4524257
  // const {_id, owner, ...request} = item;
  return createItem(item)
    .then((item) => {
      // save all result to itemCache
      dispatch(addItemCache(item));
      return item;
    })
    .catch(dispatchError(dispatch));
};

export const attemptUpdateItem = (itemId, item) => (dispatch) => {
  return updateItem(itemId, {
    content: item.content,
    title: item.title,
    status: item.status,
    accessGroups: item.accessGroups,
    path: item.path,
  }).then((item) => {
    // save response to itemCache
    dispatch(addItemCache(item));

    RNC.addNotification({
      title: "수정 완료",
      type: "success",
      message: "성공적으로 수정 내용을 저장하였습니다",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  });
};

export const attemptUpdateItemPermission =
  (itemId, accessGroup) => (dispatch) => {
    return updateItem(itemId, { accessGroup: accessGroup }).then(
      getItem(itemId).then((item) => {
        // save response to itemCache
        dispatch(addItemCache(item));

        RNC.addNotification({
          title: "권한 수정 완료",
          type: "success",
          message: "성공적으로 항목 권한을 변경하였습니다",
          container: "top-center",
          animationIn: ["animated", "fadeInRight"],
          animationOut: ["animated", "fadeOutRight"],
          dismiss: {
            duration: 5000,
          },
        });
      })
    );
  };

export const attemptAddItemComment =
  (itemId, comments, onComplete) => (dispatch) => {
    return addItemComment(itemId, comments).then(() => {
      // save response to itemCache
      dispatch(attemptGetItem(itemId)).then((item) => onComplete(item));
    });
  };

// deleting item
export const attemptDeleteItem = (itemId) => (dispatch) => {
  return deleteItem(itemId).then(() => {
    // remove locally stored item
    dispatch(deleteItemCache(itemId));

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
  return archiveItem(itemId).then((item) => {
    // save response to itemCache
    dispatch(addItemCache(item));

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
  return publishItem(itemId).then((item) => {
    // save response to itemCache
    dispatch(addItemCache(item));

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

export const attemptDuplicateItem = (itemObject) => (dispatch) => {
  console.log(`attemptDuplicateItem Item with ${JSON.stringify(itemObject)}`);

  return createItem(itemObject).then((item) => {
    dispatch(addItemCache(item));

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
