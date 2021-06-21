import React from "react";
import marked from "marked";
import {
  getUniqueSpotlights,
  uppercaseAndUnderscore,
} from "../../common/utilities";
import ImageCheckbox from "../atoms/ImageCheckbox";

import AIRBUS_DEFENCE_AND_SPACE_GMBH from "../../assets/companies/AIRBUS_DEFENCE_AND_SPACE_GMBH.png";
import AIRBUS_DEFENCE_AND_SPACE_SA from "../../assets/companies/AIRBUS_DEFENCE_AND_SPACE_SA.png";
import BAE_SYSTEMS from "../../assets/companies/BAE_SYSTEMS.png";
import DASSAULT_AVIATION_SA from "../../assets/companies/DASSAULT_AVIATION_SA.png";
import EDO_MBM_TECHNOLOGY_LTD_UK from "../../assets/companies/EDO_MBM_TECHNOLOGY_LTD_UK.png";
import LEONARDO_SPA from "../../assets/companies/LEONARDO_SPA.png";
import LOCKHEED_MARTIN from "../../assets/companies/LOCKHEED_MARTIN.png";
import MBDA_GROUP from "../../assets/companies/MBDA_GROUP.png";
import RAYTHEON_SYSTEMS_LTD_UK from "../../assets/companies/RAYTHEON_SYSTEMS_LTD_UK.png";
import RAYTHEON_US from "../../assets/companies/RAYTHEON_US.png";
import RHEINMETALL_AG from "../../assets/companies/RHEINMETALL_AG.png";
import RWM_ITALIA_SPA from "../../assets/companies/RWM_ITALIA_SPA.png";
import THALES_GROUP from "../../assets/companies/THALES_GROUP.png";

const assetMap = {
  AIRBUS_DEFENCE_AND_SPACE_GMBH: AIRBUS_DEFENCE_AND_SPACE_GMBH,
  AIRBUS_DEFENCE_AND_SPACE_SA: AIRBUS_DEFENCE_AND_SPACE_SA,
  BAE_SYSTEMS: BAE_SYSTEMS,
  DASSAULT_AVIATION_SA: DASSAULT_AVIATION_SA,
  EDO_MBM_TECHNOLOGY_LTD_UK: EDO_MBM_TECHNOLOGY_LTD_UK,
  LEONARDO_SPA: LEONARDO_SPA,
  LOCKHEED_MARTIN: LOCKHEED_MARTIN,
  MBDA_GROUP: MBDA_GROUP,
  RAYTHEON_SYSTEMS_LTD_UK: RAYTHEON_SYSTEMS_LTD_UK,
  RAYTHEON_US: RAYTHEON_US,
  RHEINMETALL_AG: RHEINMETALL_AG,
  RWM_ITALIA_SPA: RWM_ITALIA_SPA,
  THALES_GROUP: THALES_GROUP,
};

const SpotlightListPanel = ({
  spotlights,
  activeSpotlight,
  onSpotlightSelect,
  language,
  title,
  description,
}) => {
  const uniqueSpotlights = getUniqueSpotlights(spotlights);
  return (
    <div className="react-innertabpanel">
      <h2>{title}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: marked(description),
        }}
      />
      <div>
        {uniqueSpotlights.map((val) => {
          const formattedTitle = uppercaseAndUnderscore(val.title);
          return (
            <li
              key={val.title.replace(/ /g, "_")}
              className="filter-filter active"
              style={{ marginLeft: "20px" }}
            >
              <ImageCheckbox
                asset={assetMap[formattedTitle]}
                isActive={val.title === activeSpotlight}
                onClickCheckbox={() => onSpotlightSelect(val.title)}
                styleProps={val.styles}
              />
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default SpotlightListPanel;
