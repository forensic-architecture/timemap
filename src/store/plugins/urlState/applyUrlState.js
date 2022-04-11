import { ASSOCIATION_MODES } from "../../../common/constants";
import { mapFilterIdsToPaths } from "./helpers";

export function applyUrlState(currentState, { domain, urlState }) {
  if (!Object.keys(urlState).length) return currentState;

  const state = { ...currentState };

  if (urlState.id?.length) {
    state.selected = urlState.id.map((id) => domain.events[id]);
  }

  // TODO: fit to selected events if no timerange is set.
  if (urlState.start_date && urlState.end_date) {
    state.timeline.range = [urlState.start_date, urlState.end_date];
  }

  const hasFilters = urlState.filter?.length;
  const hasColors = urlState.color?.length;

  if (!hasFilters && !hasColors) return state;

  const filters = domain.associations.filter(
    (x) => x.mode === ASSOCIATION_MODES.FILTER
  );
  const filterMapping = mapFilterIdsToPaths(filters);

  if (hasFilters) {
    // TODO: set parent filters if all children checked
    state.associations.filters = urlState.filter.map((id) => filterMapping[id]);
  }

  if (hasColors) {
    // TODO: color parent if all children checked
    state.associations.coloringSet = urlState.color.map((set) =>
      set.split(",").map((id) => filterMapping[id])
    );
  }

  return state;
}
