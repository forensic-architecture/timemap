import { SCHEMA } from "./schema";
import URLState from "./urlState";

export function urlStateMiddleware(store) {
  return (next) => (action) => {
    const result = next(action);

    try {
      const schemas = Object.values(SCHEMA).filter(
        (s) => s.trigger === action.type
      );

      if (schemas.length) {
        const urlState = new URLState();
        const state = store.getState();
        schemas.forEach((s) => {
          urlState.set(s.key, s.dehydrate(state));
        });
        urlState.serialize();
      }
    } catch (err) {
      console.error("error serializing url state", err);
    }

    return result;
  };
}
