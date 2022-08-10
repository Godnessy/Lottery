import { useEffect, useState,useRef } from "react";
import "./App.css";
import React from "react";
import logo from "./images/mtt_logo.png";
import { db } from "./firebase-config";
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
import List from "./Components/List";
import Prizes from "./Components/Prizes";

/*
Todo:
- Change the way the submit proccess works - Take away the automatic array forming from the tickets variable and add a function that will do that only when the submit button is pressed and not before.
1. make the prizes edit and delete buttons update the DB last number
2. Instead of making an array of each player with all the numbers, make an array with start and finish numbers and check if the winning number is between these numbers.
3. fetch data from DB on the next page -
4. create the play page which will show: player list, prize list, roll button and winner area.
5. !! make an env file to store the firebase config
*/

function App() {
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState("");
  const [testList, setTestList] = useState([]);
  const [updateList,setUpdateList] = useState(false)
  const namesCollectionRef = collection(db, "players");
  const nameRef = useRef('')
  const prizeRef =useRef('')
  
 


  const getUserList = async () => {
      const data = query(namesCollectionRef, orderBy("time", "asc"));
      const dataSnapshot = await getDocs(data);
      setTestList(
        dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
  }

  const getLastNumberFromDB = async () =>{
      const docRef = doc(db, "playersNumber", "lastNumber");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().lastNumber
    }
    return 0
  }


  const setLastNumberDB = async (number) =>{
    const lastNumberRef = doc(db, "playersNumber", "lastNumber");
    await updateDoc(lastNumberRef, {
      lastNumber: number
    });
  }

  const registerNewPlayer = async(name,playerFirstNumber,playerLastNumber)=>{
    await addDoc(namesCollectionRef, {
      name,
      firstTicket: playerFirstNumber,
      lastTicket: playerLastNumber,
      time: Date.now(),
    });
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tickets === 0 ){
      alert(`Kan ikke kjøpe 0 billeter`)
      return
    }
    const dbOldLastNumber =  await getLastNumberFromDB();
    const playerFirstNumber = (dbOldLastNumber+1);
    const playerLastNumber = (playerFirstNumber + tickets)
    registerNewPlayer(name,playerFirstNumber,playerLastNumber)
    await setLastNumberDB(playerLastNumber)
    setUpdateList(!updateList)
    setName("");
    setTickets("");
  };

  useEffect(() => {
    getUserList()
    nameRef.current.focus()
    prizeRef.current.focus()
    console.log('use effect activated in App.js');
  }, [updateList]);


  const editPlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const playerToEdit = testList.filter((player) => player.id === id);
    const remainingPlayers = testList.filter((player) => player.id !== id);
    await deleteDoc(playerDoc);
    setTestList(remainingPlayers);
    if (remainingPlayers.length == 0) {
     await setLastNumberDB(0)
    }
    setName(playerToEdit[0].name);
    setTickets(playerToEdit[0].tickets.length);
  };

  const resetList = async (list) => {
    list.map((player) => {
      const { id } = player;
      const playerDoc = doc(db, "players", id);
      deleteDoc(playerDoc);
      return setLastNumberDB(0)
    });
    
  };

  const deletePlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const remainingPlayers = testList.filter((player) => player.id !== id);
    await deleteDoc(playerDoc);
    setTestList(remainingPlayers);
    if (remainingPlayers.length == 0) {
      await setLastNumberDB(0)
    }
  };



  return (
    <main>
      <img src={logo} alt="" className="logo" />
      <h1 className="title">MTT Fredags Lotteri</h1>

      <div className="setup-container">
        <div className="setup-box">
          <form
            className="form main-form"
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <p className="info">
              Skriv navnet på deltakeren og hvor mange billetter de ønsker:
            </p>
            <div className="nameCell">
              <div>
                <label className="labels nameLabel">Navn:</label>
                <input
                  type="text"
                  ref = {nameRef}
                  className="newName name"
                  value={name}
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="labels">Antall billetter:</label>
                <input
                  value={tickets}
                  className="newName newTickets"
                  required
                  ref = {prizeRef}
                  onChange={(e) => {
                    setTickets(Number(e.target.value));
                  }}
                />
              </div>
            </div>
            <div className="btn-container">
              <button className="btn" id="btn-addPlayer" type="submit">
                Legg til
              </button>
              <button
                className="btn-reset"
                type="button"
                onClick={() => resetList(testList)}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="list">
            <div className="titles-container">
              <h2 className="list-name">Navn</h2>
              <h2 className="list-numbers">Billet Nummere</h2>
            </div>
            <div className="list-items-container">
              <List
                testList={testList}
                editPlayer={editPlayer}
                deletePlayer={deletePlayer}
              />
            </div>
          </div>
        </div>
        <div className="prize-container">
          <Prizes></Prizes>
        </div>
      </div>
    </main>
  );
}

export default App;
