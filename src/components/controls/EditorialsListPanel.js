import React from "react";
import marked from "marked";
import copy from "../../common/data/copy.json";

const EditorialsListPanel = ({
  editorials,
  selectedEditorial,
  onSelectEditorial,
  language,
}) => {
  function renderEditorialList() {
    return (
      <div>
        {editorials.map((ed) => {
          return (
            <li key={ed.title.replace(/ /g, "_")}>
              <a href={`/story/id=${ed.id}`}>{ed.title}</a>
            </li>
          );
        })}
      </div>
    );
  }
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
      {renderEditorialList()}
    </div>
  );
};

export default EditorialsListPanel;
