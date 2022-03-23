import React from "react";
import copy from "../../../../common/data/copy.json";
import { language } from "../../../../common/utilities";
import mapImg from "../../../../assets/satelliteoverlaytoggle/map.png";
import satImg from "../../../../assets/satelliteoverlaytoggle/sat.png";

const SatelliteOverlayToggle = ({
  switchToSatellite,
  reset,
  isUsingSatellite,
}) => {
  return (
    <div id="satellite-overlay-toggle" className="satellite-overlay-toggle">
      {isUsingSatellite ? (
        <button
          className="satellite-overlay-toggle-button satellite-overlay-toggle-map"
          style={{ backgroundImage: `url(${mapImg}` }}
          onClick={reset}
        >
          <div class="label">{copy[language].tiles.default}</div>
        </button>
      ) : (
        <button
          className="satellite-overlay-toggle-button satellite-overlay-toggle-sat"
          style={{ backgroundImage: `url(${satImg}` }}
          onClick={switchToSatellite}
        >
          <div class="label">{copy[language].tiles.satellite}</div>
        </button>
      )}
    </div>
  );
};

export default SatelliteOverlayToggle;
