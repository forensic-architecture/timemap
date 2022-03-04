import React from "react";

import copy from "../../../common/data/copy.json";
import { isNotNullNorUndefined } from "../../../common/utilities";

const CardTime = ({ title = "Timestamp", timelabel, language, precision }) => {
  const unknownLang = copy[language].cardstack.unknown_time;

  if (isNotNullNorUndefined(timelabel)) {
    return (
      <div className="card-cell">
        {/* <i className="material-icons left">today</i> */}
        <h4>{title}</h4>
        {timelabel}
        {precision && precision !== "" ? ` - ${precision}` : null}
      </div>
    );
  } else {
    return (
      <div className="card-cell">
        {/* <i className="material-icons left">today</i> */}
        <h4>{title}</h4>
        {unknownLang}
      </div>
    );
  }
};

export default CardTime;
