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
} from "firebase/firestore";
import List from "./Components/List";
import Prizes from "./Components/Prizes";

/*
Todo:
1. Make a DB and connect it to the app - used firebase  
2. save people and tickets array to DB - done
3. fetch data from DB on the next page -
4. !! make an env file to store the firebase config
*/

function App() {
  const [list, setList] = useState({});
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState("");
  const [lastNumber, setLastNumber] = useState(0);
  const [newTickets, setnewTickets] = useState([]);
  const [testList, setTestList] = useState([]);
  const namesCollectionRef = collection(db, "players");
  const [data, setData] = useState([]);

  const createNewName = async (e) => {
    e.preventDefault();
    await addDoc(namesCollectionRef, {
      name,
      tickets: newTickets,
      time: Date.now(),
    });
    setLastNumber(Number(newTickets.slice(-1)));
    setName("");
    setTickets("");
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = query(namesCollectionRef, orderBy("time", "asc"));
      const dataSnapshot = await getDocs(data);
      setData(dataSnapshot);
      setTestList(
        dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    return () => {
      console.log("call made");
      getUsers();
    };
  }, [lastNumber]);

  useEffect(() => {}, [name, tickets]);

  //how to update:

  const editPlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const playerToEdit = testList.filter((player) => player.id === id);
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
    console.log(remainingPlayers.length);
    if (remainingPlayers.length == 0) {
      setLastNumber(0);
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
              Skriv navnet på personen og hvor mange billetter de ønsker:
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
