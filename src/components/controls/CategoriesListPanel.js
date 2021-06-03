import React from "react";
import marked from "marked";
import PanelTree from "./atoms/PanelTree";
import { ASSOCIATION_MODES, DATASHEET_FALSE } from "../../common/constants";

const CategoriesListPanel = ({
  categories,
  activeCategories,
  onCategoryFilter,
  language,
  title,
  description,
}) => {
  const filteredCategories = categories.filter(
    (f) => f.display !== DATASHEET_FALSE
  );
  return (
    <div className="react-innertabpanel">
      <h2>{title}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: marked(description),
        }}
      />
      <PanelTree
        data={filteredCategories}
        activeValues={activeCategories}
        onSelect={onCategoryFilter}
        type={ASSOCIATION_MODES.CATEGORY}
      />
    </div>
  );
};

export default CategoriesListPanel;
