import React from 'react';

export default class Notification extends React.Component{

  constructor(props) {
    super();
    this.state = {
      isExtended: false
    }
  }

  toggleDetails() {
    this.setState({ isExtended: !this.state.isExtended });
  }

  renderItems(items) {
    if (!items) return '';
    return (
      <div>
        {items.map((item) => {
          if (item.error) {
            return (<p>{item.error.message}</p>);
          }
          return '';
        })}
      </div>
    )
  }

  render() {
    if (this.props.isNotification) {
      return (
        <div className={`notification-wrapper`}>
          {this.props.notifications.map(notification => (
            <div className='notification' onClick={() => this.toggleDetails() }>
              <button onClick={() => this.props.toggle()} className="side-menu-burg over-white is-active"><span /></button>
              <div className={`message ${notification.type}`}>{`${notification.message}`}</div>
              <div className={`details ${this.state.isExtended}`}>
                {(notification.items !== null) ? this.renderItems(notification.items) : ''}
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (<div/>);
  }
}
