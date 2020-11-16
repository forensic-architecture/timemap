// Sensible defaults for generating a basic card layout
// based on the example Timemap datasheet.
const basic = ({ event }) => {
  return [
    [
      {
        kind: 'date',
        title: 'Incident Date',
        value: event.datetime || event.date || ``
      },
      {
        kind: 'text',
        title: 'Location',
        value: event.location || `—`
      }
    ],
    [{ kind: 'line-break', times: 0.4 }],
    [
      {
        kind: 'text',
        title: 'Summary',
        value: event.description || ``,
        scaleFont: 1.1
      }
    ]
  ]
}

export default {
  basic
}
