import dayjs from "dayjs";

const SCHEMA = Object.freeze({
  // Events
  id: {
    type: "number",
    isArray: true,
  },
  // Associations
  filter: {
    type: "string",
    isArray: true,
  },
  // Timeline
  start_date: {
    type: "date",
    isArray: false,
  },
  end_date: {
    type: "date",
    isArray: false,
  },
});

class URLState {
  constructor() {
    this.url = new URL(window.location);
    this.schema = SCHEMA;
  }

  delete(key) {
    this.url.searchParams.delete(key);
  }

  /**
   * `key` not declared in `schema` will be ignored.
   * `value` is encoded according to the schema.
   * if the schema declares `isArray: true`, `value` is required be an array.
   */
  set(key, value) {
    const schema = this.schema[key];
    if (!schema) return;

    this.delete(key);

    if (schema.isArray) {
      value.forEach((val) => {
        const encoded = this._encode(schema, val);
        if (encoded) this.url.searchParams.append(key, encoded);
      });
    } else {
      const encoded = this._encode(schema, value);
      if (encoded) this.url.searchParams.set(key, encoded);
    }
  }

  /**
   * Returns URL state as object.
   * Values are decoded according to schema.
   */
  deserialize() {
    const state = {};

    this.url.searchParams.forEach((_, key) => {
      if (state[key] != null) return;

      const schema = this.schema[key];
      // ignore unknown query parameters
      if (!schema) return;

      state[key] = schema.isArray
        ? this.url.searchParams
            .getAll(key)
            .map((val) => this._decode(schema, val))
        : this._decode(schema, this.url.searchParams.get(key));
    });

    return state;
  }

  serialize() {
    window.history.replaceState(null, "", this.url);
  }

  _decode(schema, value) {
    if (schema.type === "number") return +value;
    if (schema.type === "date") return new Date(value);
    if (value === "null" || value === "undefined") return undefined;
    return value;
  }

  _encode(schema, value) {
    if (schema.type === "number") return value.toString();
    if (schema.type === "date") return dayjs(value).format("YYYY-MM-DD");
    return value;
  }
}

export default URLState;
