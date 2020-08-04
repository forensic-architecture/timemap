import React from 'react'

const SearchRow = ({ query, eventObj, onSearchRowClick }) => {
  const { description, location, date } = eventObj
  function getHighlightedText (text, highlight) {
    // Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return <span>{ parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <span style={{ backgroundColor: 'yellow', color: 'black' }}>{part}</span> : part) }</span>
  }

  function getShortDescription (text, searchQuery) {
    var regexp = new RegExp(`(([^ ]* ){0,6}[a-zA-Z]*${searchQuery.toLowerCase()}[a-zA-Z]*( [^ ]*){0,5})`, 'gm')
    let parts = text.toLowerCase().match(regexp)
    for (var x = 0; x < (parts ? parts.length : 0); x++) {
      parts[x] = '...' + parts[x]
    }
    const firstLine = [text.match('(([^ ]* ){0,10})', 'm')[0]]
    return parts || firstLine
  }

  return (
    <div className='search-row' onClick={() => onSearchRowClick([eventObj])}>
      <div className='location-date-container'>
        <div className='date-container'>
          <i className='material-icons'>event</i>
          <p>{getHighlightedText(date, query)}</p>
        </div>
        <div className='location-container'>
          <i className='material-icons'>location_on</i>
          <p>{getHighlightedText(location, query)}</p>
        </div>
      </div>
      <p>{getShortDescription(description, query).map(match => {
        return <span>{getHighlightedText(match, query)}...<br /></span>
      })}</p>
    </div>
  )
}

export default SearchRow
