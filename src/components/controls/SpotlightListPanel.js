import React from "react";
import marked from "marked";
import PanelTree from "./atoms/PanelTree";
import { getUniqueSpotlights } from "../../common/utilities";
import { ASSOCIATION_MODES } from "../../common/constants";

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
      <PanelTree
        data={uniqueSpotlights}
        activeValues={[activeSpotlight]}
        onSelect={onSpotlightSelect}
        type={ASSOCIATION_MODES.SPOTLIGHT}
      />
    </div>
  );
};

export default SpotlightListPanel;
