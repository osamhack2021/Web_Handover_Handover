import update from "immutability-helper";
import { LOAD_GROUP } from "_actions/group";

export default function group(state = {}, action) {
  switch (action.type) {
    case LOAD_GROUP:
      return action.group;
    default:
      return state;
  }
}
