export function parseDateTimes(arrayToParse) {
  const parsedArray = [];

  arrayToParse.forEach(item => {
    let incoming_datetime = `${item.date}T00:00`;
    if (item.time) incoming_datetime = `${item.date}T${item.time}`;
    const parser = d3.timeParse(process.env.INCOMING_DATETIME_FORMAT);
    item.timestamp = d3.timeFormat("%Y-%m-%dT%H:%M:%S")(parser(incoming_datetime));

    parsedArray.push(item);
  });

  return parsedArray;
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
