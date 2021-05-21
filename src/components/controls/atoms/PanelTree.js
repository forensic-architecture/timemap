import React from "react";
import Checkbox from "../../atoms/Checkbox";

const PanelTree = ({ data, activeValues, onSelect, defaultCheckboxColor }) => {
  return (
    <div>
      {data.map((val) => {
        const isActive = activeValues.includes(val.title);
        const baseStyles = {
          background: isActive ? defaultCheckboxColor : "none",
          border: `1px solid ${defaultCheckboxColor}`,
        };
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
              styleProps={val.styles ? val.styles : baseStyles}
            />
          </li>
        );
      })}
    </div>
  );
};

export default PanelTree;
