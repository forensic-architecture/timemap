import copy from "./data/copy.json";
import { language } from "./utilities";

const cardStack = copy[language].cardstack;

// Sensible defaults for generating a basic card layout
// based on the example Timemap datasheet.

const basic = ({ event }) => {
  return [
    [
      {
        kind: "date",
        title: cardStack.date_title || "Incident Dates",
        value: event.datetime || event.date || "",
      },
      {
        kind: "text",
        title: cardStack.location_title || "Location",
        value: event.location || "—",
      },
    ],
    [{ kind: "line-break", times: 0.4 }],
    [
      {
        kind: "text",
        title: cardStack.summary_title || "Summary",
        value: event.description || "",
        scaleFont: 1.1,
      },
    ],
  ];
};

export default {
  basic,
};
