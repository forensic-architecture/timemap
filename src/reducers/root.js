import { REHYDRATE_STATE } from "../actions";
import { applyUrlState } from "../store/plugins/urlState";

export default function rootReducer(state = {}, action) {
  switch (action.type) {
    case REHYDRATE_STATE:
      return applyUrlState(state);
    default:
      return state;
  }
}
