import {
  TOGGLE_ASSOCIATIONS,
  UPDATE_COLORING_SET,
  UPDATE_SELECTED,
  UPDATE_TIMERANGE,
} from "../../../actions";
import { getSelected, getTimeRange } from "../../../selectors";
import { selectActiveColorSets, selectActiveFilterIds } from "./helpers";
import URLState from "./urlState";

function onEventsSelect(state) {
  const urlstate = new URLState();
  urlstate.set(
    "id",
    getSelected(state).map(({ id }) => id)
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
  urlstate.set("filter", selectActiveFilterIds(state));
  urlstate.serialize();
}

function onColoringSetUpdate(state) {
  const urlstate = new URLState();
  urlstate.set("color", selectActiveColorSets(state));
  urlstate.serialize();
}

export function urlStateMiddleware(store) {
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

        case UPDATE_COLORING_SET: {
          onColoringSetUpdate(state);
          break;
        }

        default: {
          break;
        }
      }
    } catch (err) {
      console.error("error serializing url state", err);
    }

    return result;
  };
}
