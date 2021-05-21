import React from "react";
import marked from "marked";
import PanelTree from "./atoms/PanelTree";

const CategoriesListPanel = ({
  categories,
  activeCategories,
  onCategoryFilter,
  language,
  title,
  description,
}) => {
  return (
    <div className="react-innertabpanel">
      <h2>{title}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: marked(description),
        }}
      />
      <PanelTree
        data={categories}
        activeValues={activeCategories}
        onSelect={onCategoryFilter}
      />
    </div>
  );
};

export default CategoriesListPanel;
