import { useSatelliteTilesOverlay, resetTilesOverlay } from "../../actions";
import initial from "../../store/initial.js";
import ui from "../ui";

describe("UI reducer", () => {
  it("can change the tiling", () => {
    const result = ui(initial.ui, useSatelliteTilesOverlay());
    expect(result.tiles.current).toEqual("satellite");
    expect(result.tiles.default).toEqual(initial.ui.tiles.default);
  });

  it("can revert to the default tiling", () => {
    const result = ui(
      {
        ...initial.ui,
        tiles: { default: "some default", current: "something else" },
      },
      resetTilesOverlay()
    );
    expect(result.tiles.current).toEqual("some default");
    expect(result.tiles.default).toEqual("some default");
  });
});
