import {
  TOGGLE_ASSOCIATIONS,
  UPDATE_SELECTED,
  UPDATE_TIMERANGE,
} from "../../../actions";
import {
  getActiveCategories,
  getActiveFilters,
  getActiveNarrative,
  getSelected,
  getTimeRange,
} from "../../../selectors";
import URLState from "./urlState";

function onEventsSelect(state) {
  const selected = getSelected(state);
  const urlstate = new URLState();
  urlstate.set(
    "id",
    selected.map(({ id }) => id)
  );
  urlstate.serialize();
}

function onTimerangeUpdate(state) {
  const timerange = getTimeRange(state);
  const urlstate = new URLState();
  urlstate.set("start_date", timerange[0]);
  urlstate.set("end_date", timerange[1]);
  urlstate.serialize();
}

function onAssociationUpdate(state) {
  const urlstate = new URLState();

  const filters = getActiveFilters(state);
  urlstate.set("filter", filters);

  urlstate.serialize();
}

function urlStateMiddleware(store) {
  return (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // handle errors to ensure `next()` is called.
    try {
      switch (action.type) {
        case UPDATE_SELECTED: {
          onEventsSelect(state);
          break;
        }

        case UPDATE_TIMERANGE: {
          onTimerangeUpdate(state);
          break;
        }

        case TOGGLE_ASSOCIATIONS: {
          onAssociationUpdate(state);
          break;
        }

        default: {
          console.log(action);
          break;
        }
      }
    } catch (err) {
      console.error("error serializing url state", err);
    }

    return result;
  };
}

export default urlStateMiddleware;
