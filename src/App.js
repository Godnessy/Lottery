import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import React from "react";
import logo from "./images/mtt_logo.png";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  updateDoc,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

/*
Todo:
1. Make a DB and connect it to the app
2. save people and tickets array to DB
3. fetch data from DB on the next page
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
      getUsers();
    };
  }, [lastNumber]);

  //how to update:

  const updatePlayer = async (id, tickets) => {
    await updateDoc(namesCollectionRef, id, newTickets);
  };

  const deleteName = async (id) => {
    const playerDoc = doc(db, "players", id);
    await deleteDoc(playerDoc);
    const remainingPlayers = testList.filter((player) => player.id !== id);
    setTestList(remainingPlayers);
    console.log(remainingPlayers);
    if (testList.length - 1 === 0) {
      setLastNumber(0);
    }
  };

  const addNewTickets = (val) => {
    if (isNaN(val)) {
      alert("Please enter a number");
      return;
    } else {
      const newArr = Array.from(new Array(val), (x, i) => i + lastNumber + 1);
      setnewTickets(newArr);
      setLastNumber(lastNumber + 1);
    }
  };

  const addNewPerson = (e) => {
    e.preventDefault();
    setList({ ...list, [name]: newTickets });
    setLastNumber(Number(newTickets.slice(-1)));
    setName("");
    setTickets("");
  };

  return (
    <main>
      <img src={logo} alt="" className="logo" />
      <h1 className="title">MTT Fredags Lotteri</h1>
      <form
        className="form"
        onSubmit={(e) => {
          createNewName(e);
        }}
      >
        <p className="info">
          Skriv navn på personen som vil kjøpe billeter og hvor mange billeter
          de vil ha
        </p>
        <div className="nameCell">
          <div>
            <label className="labels">Navn</label>
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
            <label className="labels">hvor mange?</label>
            <input
              value={tickets}
              className="newName"
              required
              onChange={(e) => {
                addNewTickets(Number(e.target.value));
                setTickets(e.target.value);
              }}
            />
          </div>
        </div>
        <button className="btn" type="submit">
          Legg til
        </button>
      </form>

      <div className="list">
        <div className="titles-container">
          <h2 className="list-name">Navn</h2>
          <h2 className="list-numbers">Billet Nummere</h2>
        </div>
        <div className="list-items">
          {testList.length > 0 &&
            testList.map((member) => {
              const { tickets, name, id } = member;
              return (
                <div key={id} className="list-item">
                  <p className="names">{`${name}`}</p>
                  <p className="numbers">{`${tickets[0]} - ${tickets.slice(
                    -1
                  )}`}</p>
                  <div className="icons">
                    <button className="edit-btn">
                      <FaEdit className="edit" />
                    </button>
                    <button className="delete-btn">
                      <FaTrash
                        className="delete"
                        onClick={() => {
                          deleteName(id);
                        }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}

export default App;
