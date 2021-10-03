import { snakeToCamelCase } from 'json-style-converter/es5';
import { getItemByUserId, getItemByItemId } from '_api/item';
import { loadUserItem } from '_actions/userItem';
import { dispatchError } from '_utils/api';

// upon success dispatches the user data in camelToSnakeCase.
// eslint-disable-next-line import/prefer-default-export
export const attemptLoadItems = (userId) => (dispatch) => getItemByUserId(userId)
  .then((data) => {
    // set item
    dispatch(loadUserItem(snakeToCamelCase(data)));
    return data;
  })
  .catch(dispatchError(dispatch));