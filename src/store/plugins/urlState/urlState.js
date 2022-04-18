import dayjs from "dayjs";
import { isSchemaArray, SCHEMA, SCHEMA_TYPES } from "./schema";

export class URLState {
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

    if (isSchemaArray(schema)) {
      value.forEach((val) => {
        const encoded = this._encode(schema, val);
        if (encoded) this.url.searchParams.append(key, encoded);
      });
    } else {
      const encoded = this._encode(schema, value);
      if (encoded) this.url.searchParams.set(key, encoded);
    }
  }

  serialize() {
    window.history.replaceState(null, "", this.url);
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

      state[key] = isSchemaArray(schema)
        ? this.url.searchParams
            .getAll(key)
            .map((val) => this._decode(schema, val))
        : this._decode(schema, this.url.searchParams.get(key));
    });

    return state;
  }

  _decode(schema, value) {
    switch (schema.type) {
      case SCHEMA_TYPES.NUMBER_ARRAY:
      case SCHEMA_TYPES.NUMBER: {
        return +value;
      }

      case SCHEMA_TYPES.DATE:
      case SCHEMA_TYPES.DATE_ARRAY: {
        return new Date(value);
      }

      default: {
        if (value === "null" || value === "undefined") return undefined;
        return value;
      }
    }
  }

  _encode(schema, value) {
    switch (schema.type) {
      case SCHEMA_TYPES.NUMBER_ARRAY:
      case SCHEMA_TYPES.NUMBER: {
        return value.toString();
      }

      case SCHEMA_TYPES.DATE:
      case SCHEMA_TYPES.DATE_ARRAY: {
        return dayjs(value).format("YYYY-MM-DD");
      }

      default: {
        return value;
      }
    }
  }
}

export default URLState;
