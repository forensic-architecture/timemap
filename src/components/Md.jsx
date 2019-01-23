/* global fetch */
import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'

class Md extends React.Component {
  constructor (props) {
    super(props)
    this.state = { md: null, error: null }
  }

  componentDidMount () {
    fetch(this.props.path)
      .then(resp => resp.text())
      .then(text => {
        if (text.length <= 0) { throw new Error() }

        this.setState({ md: marked(text) })
      })
      .catch(() => {
        this.setState({ error: true })
      })
  }

  render () {
    if (this.state.md && !this.state.error) {
      return (
        <div className='md-container' dangerouslySetInnerHTML={{ __html: this.state.md }} />
      )
    } else if (this.state.error) {
      return this.props.unloader || <div>Error: couldn't load source</div>
    } else {
      return this.props.loader
    }
  }
}

Md.propTypes = {
  loader: PropTypes.func,
  unloader: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

export default Md
