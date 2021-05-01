import React from "react";
import marked from "marked";
import Checkbox from "../atoms/Checkbox";
import copy from "../../common/data/copy.json";

const CategoriesListPanel = ({
  categories,
  activeCategories,
  onCategoryFilter,
  language,
}) => {
  function renderCategoryTree() {
    return (
      <div>
        {categories.map((cat) => {
          return (
            <li
              key={cat.title.replace(/ /g, "_")}
              className="filter-filter active"
              style={{ marginLeft: "20px" }}
            >
              <Checkbox
                label={cat.title}
                isActive={activeCategories.includes(cat.title)}
                onClickCheckbox={() => onCategoryFilter(cat.title)}
              />
            </li>
          );
        })}
      </div>
    );
  }

  return (
    <div className="react-innertabpanel">
      <h2>{copy[language].toolbar.categories}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: marked(
            copy[language].toolbar.explore_by_category__description
          ),
        }}
      />
      {renderCategoryTree()}
    </div>
  );
};

export default CategoriesListPanel;
