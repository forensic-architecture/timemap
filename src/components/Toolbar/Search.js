/* global fetch */
import React from 'react'
import copy from '../../common/data/copy.json'
import SelectFilter from './SelectFilter'

export default class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchValue: undefined,
      searchResults: []
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }

  handleSearchSubmit (e) {
    e.preventDefault()
    fetch(`api/search/${this.state.searchValue}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          searchResults: json.filters
        })
      })
  }

  handleSearchChange (event) {
    this.setState({ searchValue: event.target.value })
  }

  renderSearchResults () {
    return (
      this.state.searchResults.map(filter => {
        return (
          <SelectFilter
            isShowTree
            filters={this.props.filters}
            categories={this.props.categories}
            filterFilters={this.props.filterFilters}
            categoryFilters={this.props.categoryFilters}
            filter={this.props.filter}
            isCategory={this.props.isCategory}
          />
        )
      })
    )
  }

  render () {
    return (
      <div className='search-content'>
        <h2>{copy[this.props.language].toolbar.panels.search.title}</h2>
        <form onSubmit={this.handleSearchSubmit}>
          <input
            value={this.state.searchValue}
            onChange={this.handleSearchChange}
            autoFocus
            type='text'
            name='search-input'
            placeholder={copy[this.props.language].toolbar.panels.search.placeholder}
          />
        </form>
        <ul>
          {this.renderSearchResults()}
        </ul>
      </div>
    )
  }
}
