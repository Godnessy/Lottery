import { useEffect, useState } from "react";
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
import { getByTitle } from "@testing-library/react";

/*
Todo:
1. make the prizes edit and delete buttons work including DB update
3. fetch data from DB on the next page -
4. create the play page which will show: player list, prize list, roll button and winner area.
5. !! make an env file to store the firebase config
*/

function App() {
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState("");
  const [lastNumber, setLastNumber] = useState(0);
  const [newTickets, setnewTickets] = useState([]);
  const [testList, setTestList] = useState([]);
  const [data, setData] = useState([]);
  const namesCollectionRef = collection(db, "players");
  const [tempLastNumber, setTempLastNumber] = useState(null);


  const getUserList = async () => {
      const data = query(namesCollectionRef, orderBy("time", "asc"));
      const dataSnapshot = await getDocs(data);
      setData(dataSnapshot);
      setTestList(
        dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
  }

  const getLastTicketNumber = async () =>{
      const docRef = doc(db, "playersNumber", "lastNumber");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const {lastNumber} = docSnap.data()
        setLastNumber(lastNumber)
      } else {
        console.log("No such document!");
      }
    }


  const updateLastNumber = async (number) =>{
    const lastNumberRef = doc(db, "playersNumber", "lastNumber");
    await updateDoc(lastNumberRef, {
      lastNumber: number
    });
  }

  const createNewName = async (e) => {
    e.preventDefault();
    await addDoc(namesCollectionRef, {
      name,
      tickets: newTickets,
      time: Date.now(),
    });
    const newLastNumber = Number(newTickets.slice(-1))
    setLastNumber(newLastNumber);
    updateLastNumber(newLastNumber)
    setName("");
    setTickets("");
  };

  useEffect(() => {
    getUserList()
    getLastTicketNumber();
    console.log('call made')
  }, [lastNumber]);


  const editPlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const playerToEdit = testList.filter((player) => player.id === id);
    const remainingPlayers = testList.filter((player) => player.id !== id);
    await deleteDoc(playerDoc);
    setTestList(remainingPlayers);
    if (remainingPlayers.length == 0) {
      setLastNumber(0);
      updateLastNumber(0)
    }
    setName(playerToEdit[0].name);
    setTickets(playerToEdit[0].tickets.length);
  };

  const resetList = async (list) => {
    list.map((player) => {
      const { id } = player;
      const playerDoc = doc(db, "players", id);
      deleteDoc(playerDoc);
      setLastNumber(0);
    });
  };

  const deletePlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const remainingPlayers = testList.filter((player) => player.id !== id);
    await deleteDoc(playerDoc);
    setTestList(remainingPlayers);
    if (remainingPlayers.length == 0) {
      setLastNumber(0);
      updateLastNumber(0)
    }
  };

  const addNewTickets = (val) => {
    if (isNaN(val)) {
      alert("Please enter a number");
      setTickets(0);
      return;
    } else {
      const newArr = Array.from(new Array(val), (x, i) => i + lastNumber + 1);
      setnewTickets(newArr);
      setLastNumber(lastNumber + 1);
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
              createNewName(e);
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
                  onChange={(e) => {
                    addNewTickets(Number(e.target.value));
                    setTickets(e.target.value);
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
            <div>
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
