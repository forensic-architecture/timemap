import initial from "../store/initial.js";

import { TOGGLE_SATELLITE_VIEW } from "../actions";

function ui(uiState = initial.ui, action) {
  switch (action.type) {
    case TOGGLE_SATELLITE_VIEW:
      return {
        ...uiState,
        tiles: {
          ...uiState.tiles,
          current:
            uiState.tiles.current === "satellite"
              ? uiState.tiles.default
              : "satellite",
        },
      };
    default:
      return uiState;
  }
}

export default ui;
