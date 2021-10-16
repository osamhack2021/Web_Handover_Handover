import { loadGroup } from '_actions/group';
import { getGroupByGroupId } from '_api/group';
import { dispatchError } from '_utils/api';

export const attemptGetGroup = (id) => (dispatch) => getGroupByGroupId(id)
  .then((data) => {
    dispatch(loadGroup(data));
    return data;
  })
  .catch(dispatchError(dispatch));
