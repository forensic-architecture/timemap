import { UPDATE_SELECTED, UPDATE_TIMERANGE } from "../../../actions";
import URLState from "./urlState";

function onEventsSelected(action) {
  const state = new URLState();
  const ids = action.selected.map(({ id }) => id);
  state.set("id", ids);
  state.serialize();
}

function onTimerangeUpdated(action) {
  const state = new URLState();
  state.set("fromDate", action.timerange[0]);
  state.set("toDate", action.timerange[1]);
  state.serialize();
}

function urlStateMiddleware(store) {
  return (next) => (action) => {
    // handle errors to ensure `next()` is called.
    try {
      switch (action.type) {
        case UPDATE_SELECTED: {
          onEventsSelected(action);
          break;
        }

        case UPDATE_TIMERANGE: {
          onTimerangeUpdated(action);
          break;
        }

        default: {
          break;
        }
      }
    } catch (err) {
      console.error("error serializing url state", err);
    }

    return next(action);
  };
}

export default urlStateMiddleware;
