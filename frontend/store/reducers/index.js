import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import group from "./group";
import itemCache from "./itemCache";
import user from "./user";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    group,
    itemCache,
  });

export default createRootReducer;
