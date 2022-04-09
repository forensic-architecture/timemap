import { UPDATE_SELECTED } from "../../actions";

/**
 * This class is used in two places:
 *   1. in the middleware below to serialize state to the URL.
 *   2. in `Layout` where the result `.deserialize()` is passed to an action to restore app state.
 * ! This class assumes that arrays are stored.
 * ! If you need to store primitive values, this class will have to be adjusted.
 */
export class UrlState {
  constructor() {
    this.url = new URL(window.location);

    /**
     * State is persisted using search parameter *arrays*.
     * This schema specifies the type of each array member.
     */
    this.schema = {
      id: "number",
    };
  }

  delete(key) {
    this.url.searchParams.delete(key);
  }

  update(key, values) {
    this.delete(key);

    values.forEach((val) => {
      this.url.searchParams.append(key, val);
    });
  }

  serialize() {
    window.history.replaceState(null, "", this.url);
  }

  deserialize() {
    const state = {};

    this.url.searchParams.forEach((_, key) => {
      // skip duplicate deserialization for array members.
      if (state[key] == null) {
        state[key] = this._deserializeKey(key);
      }
    });

    return state;
  }

  _deserializeKey(key) {
    return this.url.searchParams
      .getAll(key)
      .map((val) => (this.schema[key] === "number" ? +val : val));
  }
}

export function urlStateMiddleware(store) {
  return (next) => (action) => {
    /**
     * Selected events are persisted to the URL as a query parameter array -> `id=5&id=3`.
     */
    if (action.type === UPDATE_SELECTED) {
      const state = new UrlState();
      state.update(
        "id",
        action.selected.map(({ id }) => id)
      );
      state.serialize();
    }

    return next(action);
  };
}
