import React, { useState } from "react";

const StateOptions = ({ showing, onClickHandler, timelineDims }) => {
  const [checked, setChecked] = useState(false);
  const handleCheck = () => setChecked(!checked);
  const onNarrativise = () => onClickHandler(checked);

  if (!showing) {
    return null;
  }

  return (
    <div className="stateoptions-panel" style={{ bottom: timelineDims.height }}>
      <div>
        <div className="button" onClick={onNarrativise}>
          Narrativise
        </div>
        <label for="withlines">Connect by lines</label>
        <input
          name="withlines"
          onClick={handleCheck}
          checked={checked}
          type="checkbox"
        />
      </div>
    </div>
  );
};

export default StateOptions;
