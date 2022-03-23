import initial from "../store/initial.js";

import { USE_SATELLITE_TILES_OVERLAY, RESET_TILES_OVERLAY } from "../actions";

function ui(uiState = initial.ui, action) {
  switch (action.type) {
    case USE_SATELLITE_TILES_OVERLAY:
      return {
        ...uiState,
        tiles: {
          ...uiState.tiles,
          current: "satellite",
        },
      };
    case RESET_TILES_OVERLAY:
      return {
        ...uiState,
        tiles: {
          ...uiState.tiles,
          current: uiState.tiles.default,
        },
      };
    default:
      return uiState;
  }
}

export default ui;
