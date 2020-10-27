import React from 'react'

export default ({ label, isActive, onClickCheckbox, backgroundColor }) => {
  const styles = ({
    background: isActive ? backgroundColor : 'none',
    border: `1px solid ${backgroundColor}`
  })

  return (
    <div className={(isActive) ? 'item active' : 'item'}>
      <span onClick={() => onClickCheckbox()}>{label}</span>
      <button onClick={() => onClickCheckbox()}>
        <div className='checkbox' style={styles} />
      </button>
    </div>
  )
}
