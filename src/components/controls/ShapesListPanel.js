import React from "react";
import marked from "marked";
import PanelTree from "./atoms/PanelTree";
import { mapStyleByShape } from "../../common/utilities";

const ShapesListPanel = ({
  shapes,
  activeShapes,
  onShapeFilter,
  language,
  title,
  description,
  checkboxColor,
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
        defaultCheckboxColor={checkboxColor}
      />
    </div>
  );
};

export default ShapesListPanel;
