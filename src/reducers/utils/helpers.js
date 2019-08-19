import { timeFormat, timeParse } from 'd3'

export function parseDateTimes (arrayToParse) {
  const parsedArray = []

  arrayToParse.forEach(item => {
    let incomingDateTime = `${item.date}T00:00`
    if (item.time) incomingDateTime = `${item.date}T${item.time}`
    const parser = timeParse(process.env.INCOMING_DATETIME_FORMAT)
    item.timestamp = timeFormat('%Y-%m-%dT%H:%M:%S')(parser(incomingDateTime))

    parsedArray.push(item)
  })

  return parsedArray
}

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
