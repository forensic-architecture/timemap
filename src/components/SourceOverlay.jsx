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

  function toMedia(path) {
    let type;
    switch (true) {
      case /\.(png|jpg)$/.test(path):
        type = 'Image'; break
      case /\.(mp4)$/.test(path):
        type = 'Video'; break
      case /\.(md)$/.test(path):
        type = 'Text'; break
      default:
        type = 'Unknown'; break
    }
    return { type, path }
  }

  function getTypeCounts(media) {
    let counts = { Image: 0, Video: 0, Text: 0 }
    media.forEach(m => {
      counts[m.type] += 1
    })
    return counts
  }

  function _renderPath(media) {
    const { path, type } = media
    switch (type) {
      case 'Image':
        return renderImage(path)
      case 'Video':
        return renderVideo(path)
      case 'Text':
        return renderText(path)
      default:
        return renderNoSupport(path.split('.')[1])
    }
  }

  function _renderCounts(counts) {
    const strFor = type =>
    counts[type] > 0 ?
      `${counts[type]} ${type.toLowerCase()}${counts[type] > 1 ? 's': ''}`
      : ''
    const img = strFor('Image')
    const vid = strFor('Video')
    const txt = strFor('Text')

    return (
      <div>
        {img ? img : ''}
        {vid ? `, ${vid}`: ''}
        {txt ? `, ${txt}`: ''}
      </div>
    )
  }

  function _renderContent(media) {
    return (
      <React.Fragment>
        {media.map(_renderPath)}
      </React.Fragment>
    )
  }

  if (typeof(source) !== 'object') {
    return renderError()
  }
  const {id, url, title, paths, date, type, desc} = source
  const media = paths.map(toMedia)
  const counts = getTypeCounts(media)


  return (
    <div className="mo-overlay">
      <div className="mo-container">
        <div className="mo-header">
          <div className="mo-header-close" onClick={onCancel}>
            <button className="side-menu-burg is-active"><span></span></button>
          </div>
          <div className="mo-header-text">{source.title}</div>
        </div>
        <div className="mo-media-container">
          {_renderContent(media)}
        </div>
        <div className="mo-meta-container">
          <div className="mo-box">
            {title? <div><b>{title}</b></div> : null}
            <div>{_renderCounts(counts)}</div>
            {type ? <div>{type}</div> : null}
            {date ? <div>Date:<span className="indent">{date}</span></div> : null}
            {url ? <div><a href={url} target="_blank">Link to original URL</a></div> : null}
            <hr />
            {desc ? <div>{desc}</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourceOverlay
