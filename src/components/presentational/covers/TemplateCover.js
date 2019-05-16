import React from 'react'
import { connect } from "react-redux"
import MediaOverlay from '../../Overlay/Media'

const ReactMarkdown = require('react-markdown')

const MEDIA_HIDDEN = -2
const MEDIA_HOWTO = -1

class TemplateCover extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      video: MEDIA_HIDDEN
    }
  }

  getVideo(index) {
    if(index == MEDIA_HOWTO) {
      return this.props.cover.howToVideo
    } else if(index >= 0) {
      return this.props.cover.videos[index]
    } else {
      return null
    }
  }

  render () {
    var video = this.getVideo(this.state.video)
    return (
      <div className='default-cover-container'>
        <div className="cover-content">
          {
            this.props.cover.bgVideo ? (
              <div className={`fullscreen-bg ${!this.props.showing ? 'hidden' : ''}`}>
                <video
                  loop
                  muted
                  autoPlay
                  preload='auto'
                  className='fullscreen-bg__video'
                >
                <source src={this.props.cover.bgVideo} type='video/mp4' />
                </video>
              </div>
            ) : null
          }
          <h1 style={{ 'margin-bottom': '-20px', 'text-align': 'center' }}>{this.props.cover.title}</h1>
          <h3 style={{ 'text-align': 'center' }}>{this.props.cover.subtitle}</h3>
          {
            this.props.cover.subsubtitle ? (
              <h5 style={{ 'text-align': 'center', 'margin-top': '-10px' }}>{this.props.cover.subsubtitle}</h5>
            ) : null
          }
          <hr />
          <div className='hero thin'>
          {
            this.props.cover.howToVideo ? (
              <div className='row'>
                <div className='cell plain' onClick={() => this.setState({ video: -1 })}>
                  How to Use the Platform
                </div>
              </div>
            ) : null
          }
            <div className='row'>
              <div className='cell yellow' onClick={this.props.showAppHandler}>
                EXPLORE
              </div>
            </div>
          </div>

          <ReactMarkdown source={this.props.cover.description} />

          {
            this.props.cover.videos ? (
              <div className='hero'>
                <div className='row'>
                  { this.props.cover.videos.slice(0,4).map( (media, index) => (
                    <div className='cell small' onClick={() => this.setState({ video: index })} >
                      {media.buttonTitle}<br />{media.buttonSubtitle}
                    </div>
                  )) }
                </div>
              </div>
            ) : null
          }
        </div>

        {
          this.state.video != MEDIA_HIDDEN ? (
          <MediaOverlay
            opaque
            source={
              {
              title: video.title,
              desc: video.desc,
              paths: [video.file],
              poster: video.poster
            }}
            onCancel={() => this.setState({ video: MEDIA_HIDDEN })}
          />
        ) : null }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cover : state.app.cover
  }
}

export default connect(mapStateToProps) (TemplateCover);
