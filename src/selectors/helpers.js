/**
 * Some handy helpers
 */

import { createFilterPathString } from "../common/utilities";

/**
 * Given an event and a time range,
 * returns true/false if the event falls within timeRange
 */
export function isTimeRangedIn(event, timeRange) {
  const eventTime = event.datetime;
  return timeRange[0] < eventTime && eventTime < timeRange[1];
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function toIds(arr, filterMapping) {
  return arr.reduce((acc, path) => {
    const id = filterMapping[path];
    if (id) acc.push(id);
    return acc;
  }, []);
}

export function mapFilterPathsToIds(filters) {
  return filters.reduce((acc, curr) => {
    acc[createFilterPathString(curr)] = curr.id;
    return acc;
  }, {});
}

export function mapFilterIdsToPaths(filters) {
  return filters.reduce((acc, curr) => {
    acc[curr.id] = createFilterPathString(curr);
    return acc;
  }, {});
}
