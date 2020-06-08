import React from 'react'

export default class Notification extends React.Component {
  constructor (props) {
    super()
    this.state = {
      isExtended: false
    }
  }

  toggleDetails () {
    this.setState({ isExtended: !this.state.isExtended })
  }

  renderItems (items) {
    if (!items) return ''
    return (
      <div>
        {items.map((item) => {
          if (item.error) {
            return (<p>{item.error.message}</p>)
          }
          return ''
        })}
      </div>
    )
  }

  renderNotificationContent (notification) {
    let { type, message, items } = notification

    return (
      <div>
        <div className={`message ${type}`}>
          {message}
        </div>
        <div className={`details ${this.state.isExtended}`}>
          {(items !== null) ? this.renderItems(items) : ''}
        </div>
      </div>
    )
  }

  render () {
    if (!this.props.notifications) return null
    const notificationsToRender = this.props.notifications.filter(n => !('isRead' in n && n.isRead))
    if (notificationsToRender.length > 0) {
      return (
        <div className={`notification-wrapper`}>
          {this.props.notifications.map((notification) => {
            return (
              <div className='notification' onClick={() => this.toggleDetails()}>
                <button
                  onClick={this.props.onToggle}
                  className='side-menu-burg over-white is-active'
                >
                  <span />
                </button>
                {this.renderNotificationContent(notification)}
              </div>
            )
          })
          }
        </div>
      )
    }
    return (<div />)
  }
}
