import React from 'react'
import Img from 'react-image'
import { Player } from 'video-react'
import Spinner from './presentational/Spinner'
import NoSource from './presentational/NoSource'

function SourceOverlay ({ source, onCancel }) {
  function renderImage(path) {
    return (
      <div className='source-image-container'>
        <Img
          className='source-image'
          src={path}
          loader={<Spinner />}
          unloader={<NoSource failedUrls={source.paths} />}
        />
      </div>
    )
  }

  function renderVideo(path) {
    // NB: assume only one video
    return (
      <div className="media-player">
        <Player
          className='source-video'
          playsInline
          src={path}
        />
      </div>
    )
  }

  function renderText(path) {
    return (<div>{path}</div>)
  }

  // renderImagebook() {
  //   return (
  //     <div className='source-image-container'>
  //       {source.paths.map((url, idx) => (
  //         <Img
  //           key={idx}
  //           className='source-image'
  //           src={url}
  //           loader={<Spinner />}
  //           unloader={<NoSource failedUrls={[source.path]} />}
  //         />
  //
  //       ))}
  //     </div>
  //   )
  // }

  function renderError() {
    return (
      <NoSource failedUrls={["NOT ALL SOURCES AVAILABLE IN APPLICATION YET"]} />
    )
  }

  function renderNoSupport(ext) {
    return (
      <NoSource failedUrls={[`Application does not support extension: ${ext}`]} />
    )
  }

  function _renderPath(path) {
    switch (true) {
      case /\.(png|jpg)$/.test(path):
        return renderImage(path)
      case /\.(mp4)$/.test(path):
        return renderVideo(path)
      case /\.(md)$/.test(path):
        return renderText(path)
      default:
        console.log('unsupported extension')
        return renderNoSupport(path.split('.')[1])
    }
  }

  function _renderContent() {
    return (
      <React.Fragment>
        {source.paths.map(_renderPath)}
      </React.Fragment>
    )
  }

  if (typeof(source) !== 'object') {
    return renderError()
  }
  const {id, url, title, date, type, affil_1, affil_2} = source
  return (
    <div className="mo-overlay">
      <div className="mo-container">
        <div className="mo-header">
          <div className="mo-header-close" onClick={onCancel}>
            <button className="side-menu-burg is-active"><span></span></button>
          </div>
          <div className="mo-header-text">{source.id}</div>
        </div>
        <div className="mo-media-container">
          {_renderContent()}
        </div>
        <div className="mo-meta-container">
          <div className="mo-box">
            {id ? <div><b>{id}</b></div> : null}
            {title? <div><b>{title}</b></div> : null}
            <hr/>
            {type ? <div>Type: <span className="indent">{type}</span></div> : null}
            {date ? <div>Date:<span className="indent">{date}</span></div> : null}
            <hr/>
            {url ? <div><a href={url} target="_blank">Link to original URL</a></div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourceOverlay
