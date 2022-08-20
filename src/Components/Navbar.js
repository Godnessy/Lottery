import React from 'react'

function Navbar() {
  return (
    <div className='navbar'>
        <ul>
            <li className='setup-button'>
                <a href='/'> Setup</a>
            </li>
            <li >
                <a href='/play' className='play-button'> Spill</a>
            </li>
        </ul>
    </div>
  )
}

export default Navbar