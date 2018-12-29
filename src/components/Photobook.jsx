import React from 'react'

class Photobook extends React.Component {


  constructor(props) {
    super(props)
    this.state ={
      isLoading: true,
      isLoaded: false
    }
    this.loadImgs = this.loadImgs.bind(this)
  }

  loadImgs() {
    console.log(this.props.src)
    Promise.resolve()
      .then(fetch(this.props.src))
      .then(res => {
        console.log(res)
      })
      .then(() => {
        this.setState({ isLoading: false, isLoaded: true })
      })
  }

  componentDidMount() {
    if (this.state.isLoading) this.loadImgs()
  }

  // componentWillReceiveProps(nextProps) {
  //
  //   if (!src.length) return this.setState({ isLoading: false, isLoaded: false })
  //   this.setState({ isLoading: true, isLoaded: false })
  // }

  render() {
    if (this.state.isLoading) {
      return <div>Loading</div>
    }
    return <div>Ciao</div>
  }
}

Photobook.propTypes = {
  loader: false,
  unloader: false,
  src: []
}

export default Photobook
