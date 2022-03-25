import { toggleSatelliteView } from "../../actions";
import initial from "../../store/initial.js";
import ui from "../ui";

describe("UI reducer", () => {
  describe("toggleSatelliteView", () => {
    it("switches to satellite view if not currently enabled", () => {
      const result = ui(initial.ui, toggleSatelliteView());
      expect(result.tiles.current).toEqual("satellite");
      expect(result.tiles.default).toEqual(initial.ui.tiles.default);
    });

    it("switches back to the default state if the satellite view is currently active", () => {
      const result = ui(
        {
          ...initial.ui,
          tiles: { default: "some default", current: "satellite" },
        },
        toggleSatelliteView()
      );
      expect(result.tiles.current).toEqual("some default");
      expect(result.tiles.default).toEqual("some default");
    });
  });
});
