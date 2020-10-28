import React from 'react'

export default ({ label, isActive, onClickCheckbox, color }) => {
  const styles = ({
    background: isActive ? color : 'none',
    border: `1px solid ${color}`
  })

  return (
    <div className={(isActive) ? 'item active' : 'item'}>
      <span style={{ color: color }}>{label}</span>
      <button onClick={onClickCheckbox}>
        <div className='checkbox' style={styles} />
      </button>
    </div>
  )
}
