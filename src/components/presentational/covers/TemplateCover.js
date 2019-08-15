import React from 'react'
import { connect } from 'react-redux'
import MediaOverlay from '../../Overlay/Media'

const ReactMarkdown = require('react-markdown')

const MEDIA_HIDDEN = -2

class TemplateCover extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      video: MEDIA_HIDDEN
    }
  }

  getVideo (index, headerEndIndex) {
    if (index < headerEndIndex) {
      return this.props.cover.headerVideos[index]
    } else if (index >= 0) {
      return this.props.cover.videos[index]
    } else {
      return null
    }
  }

  render () {
    const { headerVideos } = this.props.cover
    var video = this.getVideo(this.state.video, headerVideos.length || 0)
    return (
      <div className='default-cover-container'>
        <div className='cover-content'>
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
              headerVideos ? (
                <div className='row'>
                  { headerVideos.slice(0, 2).map((media, index) => (
                    <div className='cell plain' onClick={() => this.setState({ video: index })}>
                      {media.buttonTitle}
                    </div>
                  )) }
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
                  {/* NOTE: only take first four videos, drop any others for style reasons */}
                  { this.props.cover.videos.slice(0, 4).map((media, index) => (
                    <div className='cell small' onClick={() => this.setState({ video: index + (headerVideos.length || 0) })} >
                      {media.buttonTitle}<br />{media.buttonSubtitle}
                    </div>
                  )) }
                </div>
              </div>
            ) : null
          }
        </div>

        {
          this.state.video !== MEDIA_HIDDEN ? (
            <MediaOverlay
              opaque
              source={
                {
                  title: video.title,
                  desc: video.desc,
                  paths: [video.file],
                  poster: video.poster
                }}
              translations={video.translations}
              onCancel={() => this.setState({ video: MEDIA_HIDDEN })}
            />
          ) : null }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    cover: state.app.cover
  }
}

export default connect(mapStateToProps)(TemplateCover)
