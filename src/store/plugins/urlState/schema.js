import {
  TOGGLE_ASSOCIATIONS,
  UPDATE_COLORING_SET,
  UPDATE_SELECTED,
  UPDATE_TIMERANGE,
} from "../../../actions";
import { ASSOCIATION_MODES } from "../../../common/constants";
import { createFilterPathString } from "../../../common/utilities";
import {
  getSelected,
  getTimeRange,
  selectActiveColorSets,
  selectActiveFilterIds,
} from "../../../selectors";

export const SCHEMA_TYPES = {
  NUMBER: "NUMBER",
  NUMBER_ARRAY: "NUMBER_ARRAY",
  STRING: "STRING",
  STRING_ARRAY: "STRING_ARRAY",
  DATE: "DATE",
  DATE_ARRAY: "DATE_ARRAY",
};

export function isSchemaArray(schema) {
  return [
    SCHEMA_TYPES.DATE_ARRAY,
    SCHEMA_TYPES.NUMBER_ARRAY,
    SCHEMA_TYPES.STRING_ARRAY,
  ].includes(schema.type);
}

/**
 * Schema specifies how redux state maps to the url and vice versa.
 * `trigger`: action that triggers a call to `dehydrate()`
 * `type`: type of the mapped URL property
 * `dehydrate()`: maps redux state to url state.
 * `rehydrate()`:
 *    maps url state to redux state.
 *    !for performance reasons, this function works with a mutable ref to `state`!
 */
export const SCHEMA = Object.freeze({
  id: {
    key: "id",
    trigger: UPDATE_SELECTED,
    type: SCHEMA_TYPES.NUMBER_ARRAY,
    dehydrate(state) {
      return getSelected(state).map(({ id }) => id);
    },
    // TODO: determine time range if `range` not set.
    rehydrate(nextState, { id }) {
      if (id?.length) {
        nextState.app.selected = id.map((id) =>
          nextState.domain.events.find((e) => e.id === id)
        );
      }
    },
  },
  range: {
    key: "range",
    trigger: UPDATE_TIMERANGE,
    type: SCHEMA_TYPES.DATE_ARRAY,
    dehydrate(state) {
      return getTimeRange(state);
    },
    rehydrate(nextState, { range }) {
      if (range?.length === 2) {
        const val = Array.from(range);
        val.sort((a, b) => new Date(a) - new Date(b));
        nextState.app.timeline.range = val;
      }
    },
  },
  filter: {
    key: "filter",
    trigger: TOGGLE_ASSOCIATIONS,
    type: SCHEMA_TYPES.STRING_ARRAY,
    dehydrate(state) {
      return selectActiveFilterIds(state);
    },
    // TODO: set parent filters if all children checked.
    rehydrate(nextState, { filter }) {
      if (filter?.length) {
        const filters = nextState.domain.associations.filter(
          (x) => x.mode === ASSOCIATION_MODES.FILTER
        );
        const filterMapping = mapFilterIdsToPaths(filters);
        nextState.app.associations.filters = filter.map(
          (id) => filterMapping[id]
        );
      }
    },
  },
  color: {
    key: "color",
    trigger: UPDATE_COLORING_SET,
    type: SCHEMA_TYPES.STRING_ARRAY,
    dehydrate(state) {
      return selectActiveColorSets(state);
    },
    // TODO: color parent if all children checked.
    rehydrate(state, { color }) {
      if (color?.length) {
        const filters = state.domain.associations.filter(
          (x) => x.mode === ASSOCIATION_MODES.FILTER
        );
        const filterMapping = mapFilterIdsToPaths(filters);
        state.app.associations.coloringSet = color.map((set) =>
          set.split(",").map((id) => filterMapping[id])
        );
      }
    },
  },
});

function mapFilterIdsToPaths(filters) {
  return filters.reduce((acc, curr) => {
    acc[curr.id] = createFilterPathString(curr);
    return acc;
  }, {});
}
