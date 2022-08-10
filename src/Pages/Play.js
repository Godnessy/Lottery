import React from 'react'
import List from "../Components/List";
import Prizes from "../Components/Prizes";
import Navbar from "../Components/Navbar";
import logo from "../images/mtt_logo.png";

const Play = ()=> {
  return (
    <main>
    <div className="nav">
    <img src={logo} alt="" className="logo" />
    <Navbar></Navbar>

    </div>
    <h1 className="title">MTT Fredags Lotteri</h1>
</main>
  )
}

export default Play