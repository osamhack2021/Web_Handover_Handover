import {
  push,
} from 'connected-react-router';
import {
  camelToSnakeCase,
  snakeToCamelCase,
} from 'json-style-converter/es5';
import {
  store as RNC,
} from 'react-notifications-component';

import {
  postRegister,
  postLogin,
  postLogout,
} from '_api/auth';
import {
  login,
  logout,
} from '_actions/user';
import {
  dispatchError,
  handleSuccess,
} from '_utils/api';
import R from 'ramda';

import {
  attemptGetGroup,
} from './group';
import {
  attemptLoadItems,
} from './item';

export const attemptLogin = (userId) => (dispatch) => postLogin(userId)
  .then((data) => {
    console.log(data);
    const { user, token } = data;
    dispatch(login(snakeToCamelCase(user)));

    console.log(`Login successful: response is ${JSON.stringify(token)}`);
    RNC.addNotification({
      title: 'Success!',
      message: `JWT token = ${token}`, // TODO: change to confirmation message
      type: 'success',
      container: 'top-right',
      animationIn: ['animated', 'fadeInRight'],
      animationOut: ['animated', 'fadeOutRight'],
      dismiss: {
        duration: 5000,
      },
    });

    dispatch(push('/'));
    return data;
  })
  .catch(dispatchError(dispatch));

export const attemptRegister = (newUser) => (dispatch) => postRegister(newUser)
  .then((data) => {
    RNC.addNotification({
      title: 'Success!',
      message: data.message,
      type: 'success',
      container: 'top-right',
      animationIn: ['animated', 'fadeInRight'],
      animationOut: ['animated', 'fadeOutRight'],
      dismiss: {
        duration: 5000,
      },
    });

    return dispatch(attemptLogin(newUser));
  })
  .then(() => dispatch(push('/'))) // redirect to /
  .catch(dispatchError(dispatch));

export const attemptLogout = () => (dispatch) => postLogout()
  .then((data) => {
    dispatch(logout());

    RNC.addNotification({
      title: 'Success!',
      message: data.message,
      type: 'success',
      container: 'top-right',
      animationIn: ['animated', 'fadeInRight'],
      animationOut: ['animated', 'fadeOutRight'],
      dismiss: {
        duration: 5000,
      },
    });

    dispatch(push('/login'));
    return data;
  })
  .catch(dispatchError(dispatch));
