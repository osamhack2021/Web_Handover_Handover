import { snakeToCamelCase } from "json-style-converter/es5";
import { store as RNC } from "react-notifications-component";

import { getUser, putUser, putUserPassword } from "_api/user";
import { updateUser } from "_actions/user";

import { dispatchError } from "_utils/api";

export const attemptGetUser = () => (dispatch) => {
  const currentUserId = JSON.parse(localStorage.getItem('user'))._id;

  return getUser(currentUserId)
    .then((data) => {
      dispatch(updateUser(snakeToCamelCase(data)));
      return data;
    })
    .catch(dispatchError(dispatch));
};

export const attemptUpdateUser = (updatedUser) => (dispatch) =>
  putUser(updatedUser)
    .then((data) => {
      dispatch(updateUser(snakeToCamelCase(data)));

      RNC.addNotification({
        title: "Success!",
        message: data.message,
        type: "success",
        container: "top-center",
        animationIn: ["animated", "fadeInRight"],
        animationOut: ["animated", "fadeOutRight"],
        dismiss: {
          duration: 5000,
        },
      });

      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdatePassword = (passwordInfo) => (dispatch) =>
  putUserPassword(passwordInfo)
    .then((data) => {
      RNC.addNotification({
        title: "Success!",
        message: data.message,
        type: "success",
        container: "top-center",
        animationIn: ["animated", "fadeInRight"],
        animationOut: ["animated", "fadeOutRight"],
        dismiss: {
          duration: 5000,
        },
      });

      return data;
    })
    .catch(dispatchError(dispatch));
