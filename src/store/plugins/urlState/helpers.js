import { createSelector } from "reselect";
import { createFilterPathString } from "../../../common/utilities";
import {
  getActiveFilters,
  getColoringSet,
  getFilters,
} from "../../../selectors";

export function mapFilterIdsToPaths(filters) {
  return filters.reduce((acc, curr) => {
    acc[curr.id] = createFilterPathString(curr);
    return acc;
  }, {});
}

export function mapFilterPathsToIds(filters) {
  return filters.reduce((acc, curr) => {
    acc[createFilterPathString(curr)] = curr.id;
    return acc;
  }, {});
}

function toIds(arr, filterMapping) {
  return arr.reduce((acc, path) => {
    const id = filterMapping[path];
    if (id) acc.push(id);
    return acc;
  }, []);
}

const selectFilterPathToIdMapping = createSelector([getFilters], (filters) =>
  mapFilterPathsToIds(filters)
);

export const selectActiveColorSets = createSelector(
  [getColoringSet, selectFilterPathToIdMapping],
  (set, mapping) => {
    return set.map((set) => toIds(set, mapping).join(","));
  }
);

export const selectActiveFilterIds = createSelector(
  [getActiveFilters, selectFilterPathToIdMapping],
  (filters, mapping) => {
    return toIds(filters, mapping);
  }
);
