import React from "react";
import marked from "marked";
import PanelTree from "./atoms/PanelTree";
import { mapStyleByShape } from "../../common/utilities";
import { SHAPE } from "../../common/constants";

const ShapesListPanel = ({
  shapes,
  activeShapes,
  onShapeFilter,
  language,
  title,
  description,
}) => {
  const styledShapes = mapStyleByShape(shapes, activeShapes);
  return (
    <div className="react-innertabpanel">
      <h2>{title}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: marked(description),
        }}
      />
      <PanelTree
        data={styledShapes}
        activeValues={activeShapes}
        onSelect={onShapeFilter}
        type={SHAPE}
      />
    </div>
  );
};

export default ShapesListPanel;
