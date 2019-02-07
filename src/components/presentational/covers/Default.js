import React from 'react'

export default ({ showAppHandler }) => (
  <div className='default-cover-container'>
    <h3>Here's an example cover.</h3>
    <p>Replace it with a more descriptive one:</p>
    <ul>
      <li>Create a new component in <code>components/presentational/covers</code>.</li>
      <li>Import in in <code>components/Dashboard.jsx</code> in the <code>render</code> function.</li>
    </ul>
    <br /><br />
    <div>
      <button onClick={showAppHandler}>Go to app</button>
    </div>
  </div>
)
