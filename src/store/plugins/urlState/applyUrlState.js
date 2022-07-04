import { isEmptyObject } from "../../../common/utilities";
import { SCHEMA } from "./schema";
import URLState from "./urlState";

export function applyUrlState(state) {
  const urlState = new URLState().deserialize();
  if (isEmptyObject(urlState)) return state;

  const nextState = { ...state };

  Object.values(SCHEMA).forEach((s) => {
    try {
      s.rehydrate(nextState, urlState);
    } catch (err) {
      console.error(err);
    }
  });

  return nextState;
}
