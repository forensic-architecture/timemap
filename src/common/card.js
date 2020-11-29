import copy from './data/copy.json';
const {date_title, location_title, summary_title} = copy[process.env.store.app.language].cardstack;

// Sensible defaults for generating a basic card layout
// based on the example Timemap datasheet.

const basic = ({ event }) => {
  return [
    [
      {
        kind: 'date',
        title: date_title || 'Incident Dates',
        value: event.datetime || event.date || ``
      },
      {
        kind: 'text',
        title: location_title || 'Location',
        value: event.location || `—`
      }
    ],
    [{ kind: 'line-break', times: 0.4 }],
    [
      {
        kind: 'text',
        title: summary_title || 'Summary',
        value: event.description || ``,
        scaleFont: 1.1
      }
    ]
  ]
}

export default {
  basic
}
