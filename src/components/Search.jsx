import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'

import '../scss/search.scss'

import SearchRow from './SearchRow.jsx'

class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isFolded: true
    }
    this.onButtonClick = this.onButtonClick.bind(this)
    this.updateSearchQuery = this.updateSearchQuery.bind(this)
  }

  onButtonClick () {
    this.setState(prevState => {
      return { isFolded: !prevState.isFolded }
    })
  }

  updateSearchQuery (e) {
    let queryString = e.target.value
    this.props.actions.updateSearchQuery(queryString)
  }

  render () {
    let searchResults

    const searchAttributes = ['description', 'location', 'category', 'date']

    if (!this.props.queryString) {
      searchResults = []
    } else {
      searchResults = this.props.events.filter(event =>
        searchAttributes.some(attribute => event[attribute].toLowerCase().includes(this.props.queryString.toLowerCase()))
      )
    }

    return (
      <div class={'search-outer-container' + (this.props.narrative ? ' narrative-mode ' : '')}>
        <div id='search-bar-icon-container' onClick={this.onButtonClick}>
          <i className='material-icons'>search</i>
        </div>
        <div class={'search-bar-overlay' + (this.state.isFolded ? ' folded' : '')}>
          <div class='search-input-container'>
            <input class='search-bar-input' onChange={this.updateSearchQuery} type='text' />
            <i id='close-search-overlay' className='material-icons' onClick={this.onButtonClick} >close</i>
          </div>
          <div class='search-results'>
            {searchResults.map(result => {
              return <SearchRow onSearchRowClick={this.props.onSearchRowClick} eventObj={result} query={this.props.queryString} />
            })}
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  state => state,
  mapDispatchToProps
)(Search)
