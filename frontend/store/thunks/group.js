import { push } from 'connected-react-router';
import { camelToSnakeCase, snakeToCamelCase } from 'json-style-converter/es5';
import { store as RNC } from 'react-notifications-component';

import { getGroupByUserId } from '_api/group';
import { loadGroup } from '_actions/group';
import { dispatchError } from '_utils/api';
import { handleSuccess } from '../../utils/api';

export const attemptGetGroup = (id) => (dispatch) => getGroupByUserId(id)
  .then((data) => {
    console.log(snakeToCamelCase(data));
    dispatch(loadGroup(snakeToCamelCase(data)));
    return data;
  })
  .catch(dispatchError(dispatch));
