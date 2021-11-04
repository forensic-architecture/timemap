import React from "react";
import Checkbox from "../../atoms/Checkbox";
import { SHAPE } from "../../../common/constants";
import BatchSelectButtons from "./BatchSelectButton";

const PanelTree = ({ data, activeValues, onSelect, toggleAll, type }) => {
  // If the parent panel is of type 'CATEGORY' || 'SPOTLIGHT': filter on title. If panel is 'SHAPE': filter on id
  const onSelectionType = type === SHAPE ? "id" : "title";
  const selectAll = data.map((d) => d[onSelectionType]);

  return (
    <div>
      <BatchSelectButtons
        onSelect={() => toggleAll(selectAll)}
        onDeselect={() => toggleAll("")}
      />
      {data.map((val) => {
        return (
          <li
            key={val.title.replace(/ /g, "_")}
            className="filter-filter active"
            style={{ marginLeft: "20px" }}
          >
            <Checkbox
              label={val.title}
              isActive={activeValues.includes(val[onSelectionType])}
              onClickCheckbox={() => onSelect(val[onSelectionType])}
              styleProps={val.styles}
            />
          </li>
        );
      })}
    </div>
  );
};

export default PanelTree;
