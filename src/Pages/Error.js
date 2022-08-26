import React from 'react'
import List from "../Components/List"
import Prizes from "../Components/Prizes"
import Navbar from '../Components/Navbar'

function Error() {
  return (
    <div>
    <h4>Oops! Wrong page! Click here to go back to:</h4>
    <a href='/'> Setup</a><br></br>
    <a href='/play'> Spill</a>
    </div>

  )
}

export default Error