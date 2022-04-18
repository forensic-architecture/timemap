import { SCHEMA } from "./schema";
import URLState from "./urlState";

export function applyUrlState(state) {
  const urlState = new URLState().deserialize();
  if (isEmpty(urlState)) return state;

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

function isEmpty(o) {
  return !Object.keys(o).length;
}
