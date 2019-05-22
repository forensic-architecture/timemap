import { parseTimestamp } from '../common/utilities'
/**
* Some handy helpers
*/

/**
 * Given an event and a time range,
 * returns true/false if the event falls within timeRange
 */
export function isTimeRangedIn (event, timeRange) {
  const eventTime = parseTimestamp(event.timestamp)
  return (
    timeRange[0] < eventTime &&
    eventTime < timeRange[1]
  )
}
