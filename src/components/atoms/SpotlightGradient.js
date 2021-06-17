import React from "react";
import { colors } from "../../common/global";

const SpotlightGradient = () => {
  return (
    <defs>
      <linearGradient id="spotlight-gradient">
        <stop offset="20%" stop-color="white" />
        <stop offset="80%" stop-color={`${colors.yellow}`} />
      </linearGradient>
    </defs>
  );
};

export default SpotlightGradient;
