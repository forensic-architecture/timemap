import React from 'react'

import '../scss/search.scss'

import SearchRow from './SearchRow.jsx'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFolded : true,
            searchResults: [],
            queryString: ''
        }
        this.onButtonClick = this.onButtonClick.bind(this)
        this.updateSearchQueryResults = this.updateSearchQueryResults.bind(this)
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevProps.queryString !== this.props.queryString) {
            this.updateSearchQueryResults (this.props.queryString)
        }
    }

    onButtonClick () {
        this.setState(prevState => {
            return { isFolded : !prevState.isFolded }
        })
    }

    updateSearchQueryResults (queryString) {
        let searchResults
        if (queryString === '') {
            searchResults = []
        } else {
            searchResults = this.props.events.filter(event =>
                event.description.toLowerCase().includes(queryString.toLowerCase()) || event.location.includes(queryString) || event.category.includes(queryString)
            )
        }
        this.setState({
            searchResults: searchResults
        })
    }

    render () {
        return (
            <div class={'search-outer-container' + (this.props.narrative ? ' narrative-mode ' : '')}>
                <div id='search-bar-icon-container' onClick={this.onButtonClick}>
                    <i className='material-icons'>search</i>
                </div>
                <div class={'search-bar-overlay' + (this.state.isFolded ? ' folded' : '')}>
                    <div class='search-input-container'>
                        <input class='search-bar-input' value={this.props.queryString} onChange={this.props.onQueryUpdate} type='text' />
                        <i id='close-search-overlay' className='material-icons' onClick={this.onButtonClick} >close</i>
                    </div>
                    <div class='search-results'>
                        {this.state.searchResults.map(result => {
                            return <SearchRow query={this.props.queryString} category={result.category} location={result.location} date={result.date} description={result.description} />
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default Search;
