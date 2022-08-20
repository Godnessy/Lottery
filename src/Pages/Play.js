import React from 'react'
import { useState,useEffect } from 'react';
import List from "../Components/List";
import Prizes from "../Components/Prizes";
import Navbar from "../Components/Navbar";
import { GiCheckMark } from "react-icons/gi";
import "./Play.css"
import logo from "../images/mtt_logo.png";
import { db } from "../firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    orderBy,
    query,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
  } from "firebase/firestore";
  
  const Play = ()=> {
 const [playerList,setplayerList] = useState([])
 const [prizeList, setPrizeList] = useState([])
 const [randomNumber,setRandomNumber] = useState(null)
 const [prizePool, setPrizePool] = useState([])
 const namesCollectionRef = collection(db, "players");
 const prizesCollectionRef = collection(db, "prizes");
 const lotteryRandomNumber = document.querySelector('.winning-number')
    
    const getPlayerList = async ()=>{
            const data = query(namesCollectionRef, orderBy("time", "asc"));
            const dataSnapshot = await getDocs(data);
            setplayerList(
              dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
    }

    const getPrizes = async () => {
        const data = query(prizesCollectionRef, orderBy("number", "asc"));
        const dataSnapshot = await getDocs(data);
        setPrizeList(
          dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      };
  

    useEffect(() => {
      getPlayerList()
      getPrizes()
     console.log(`useeffect call made`);
     console.log(prizePool);
    }, [])

    useEffect(() => {
    setPrizePool(prizeList.map((prize)=>{return [prize.number,prize.id]}))
    console.log(`prizePool: ${prizePool}`);
    }, [prizeList])
    


    function setActivePrize(prizeId) {
        const activePrize = document.querySelector(`.${prizeId}`)
        activePrize.classList.add('active')

        return activePrize
      }

    function createRandomNumber(maxNumber){
      return Math.trunc(Math.random()*Math.random()*maxNumber)+1
      
    }

    function startRound(playerList){
     
    //winning player name gets inserted under the prize number/name on prize list
    //paint the bg color of the prize that was just rolled green and remove it from the prizes to be rolled list.
      if(prizePool.length == 0){
        alert(`Prize pool not ready yet`)
      } else {
      const lastNumber = playerList[playerList.length-1].lastTicket;
      const currentPrize = setActivePrize(prizePool[0][1])
      let winner = [];
   
      while (winner.length == 0){
        console.log('running while');
        let randomNumber = createRandomNumber(lastNumber);
        console.log(`random number is ${randomNumber}`);
       winner =  playerList.filter((player)=>{
            return player.firstTicket <= randomNumber && player.lastTicket >= randomNumber}) 
      }
      console.log(winner);

    }
  }

  

   
    
  return (
    <main>
    <div className="nav">
    <img src={logo} alt="" className="logo" />
    <Navbar></Navbar>
    </div>
    <h1 className="title">MTT Fredags Lotteri</h1>
    <div className="container">
    <div className=" play-list">
      {playerList.length > 0 &&
        playerList.map((player) => {
          const { firstTicket, lastTicket, name, id } = player;
          return (
            <div key={id} className="list-item">
              
              <p className="names">{`${name}`}</p>
              <p className="numbers">{`${firstTicket} - ${lastTicket
              }`}</p>
            </div>
          );
        })}

    </div>
    <div className="game-container">
      <div className="winnerAlert">Vinner premie 3 : Shlomi</div>
      
      <div className="game-number"><p className='win-title'>Vinner Tall:</p>
      <p className='winning-number'>{randomNumber}3</p>
      </div>
      <div className="game-button">
      <button className='start-game' onClick={()=>{startRound(playerList,prizeList)}}>Spill</button>
      </div>
      
    </div>

    <div className="play-prize-list">
    {prizeList.length > 0 &&
            prizeList.map((prize) => {
              const { prizeName, number, id } = prize;
              return (
                <div className="individual-prize-container">
                <div className={`prize-item ${id}`} key={id}>
                  <p className='checkMark'> <GiCheckMark /></p>
                  <h2 className='prizeNumber'>{number} : </h2>
                  <h2 className='prizeName'>{prizeName}</h2>
                  <p className='checkMark'> <GiCheckMark /></p>
                </div>
                 <p className={`winner ${id}`}>Langt navn</p>
                 <hr  style={{
                  width:100,
                      }}/>
                </div>
              );
            })} </div>
   </div>
</main>
  )
}

export default Play