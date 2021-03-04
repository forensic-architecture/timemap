import React from "react";
import marked from "marked";
import copy from "../../common/data/copy.json";

const EditorialsListPanel = ({
  editorials,
  selectedEditorial,
  onSelectEditorial,
  language,
}) => {
  return (
    <div className="react-innertabpanel">
      <h2>{copy[language].toolbar.editorials}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: marked(
            copy[language].toolbar.explore_by_editorial__description
          ),
        }}
      />
    </div>
  );
};

export default EditorialsListPanel;
