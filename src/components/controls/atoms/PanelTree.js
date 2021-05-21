import React from "react";
import Checkbox from "../../atoms/Checkbox";

const PanelTree = ({ data, activeValues, onSelect }) => {
  return (
    <div>
      {data.map((val) => {
        const isActive = activeValues.includes(val.title);
        return (
          <li
            key={val.title.replace(/ /g, "_")}
            className="filter-filter active"
            style={{ marginLeft: "20px" }}
          >
            <Checkbox
              label={val.title}
              isActive={isActive}
              onClickCheckbox={() => onSelect(val.title)}
              styleProps={val.styles}
            />
          </li>
        );
      })}
    </div>
  );
};

export default PanelTree;
