import React from "react";
import copy from "../../../../common/data/copy.json";
import { language } from "../../../../common/utilities";
import mapImg from "../../../../assets/satelliteoverlaytoggle/map.png";
import satImg from "../../../../assets/satelliteoverlaytoggle/sat.png";

const SatelliteOverlayToggle = ({ toggleView, reset, isUsingSatellite }) => {
  const buttonClass = isUsingSatellite
    ? "satellite-overlay-toggle-button satellite-overlay-toggle-map"
    : "satellite-overlay-toggle-button satellite-overlay-toggle-sat";
  const bgImage = isUsingSatellite ? mapImg : satImg;
  const label = isUsingSatellite
    ? copy[language].tiles.default
    : copy[language].tiles.satellite;

  return (
    <div id="satellite-overlay-toggle" className="satellite-overlay-toggle">
      <button
        className={buttonClass}
        style={{ backgroundImage: `url(${bgImage})` }}
        onClick={toggleView}
      >
        <div class="label">{label}</div>
      </button>
    </div>
  );
};

export default SatelliteOverlayToggle;
