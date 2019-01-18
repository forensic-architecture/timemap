/* global d3 */
export function parseDateTimes (arrayToParse) {
  const parsedArray = []

  arrayToParse.forEach(item => {
    let incomingDateTime = `${item.date}T00:00`
    if (item.time) incomingDateTime = `${item.date}T${item.time}`
    const parser = d3.timeParse(process.env.incomingDateTime_FORMAT)
    item.timestamp = d3.timeFormat('%Y-%m-%dT%H:%M:%S')(parser(incomingDateTime))

    parsedArray.push(item)
  })

  return parsedArray
}

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
