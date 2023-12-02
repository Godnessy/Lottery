import React from "react";
import { useEffect, useState, useRef } from "react";
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
import List from "../Components/List";
import Prizes from "../Components/Prizes";
import Navbar from "../Components/Navbar";
import PictureModal from "../Components/PictureModal";
import arrow from "../images/arrow.png";

const Home = () => {
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState("");
  const [playerList, setplayerList] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const namesCollectionRef = collection(db, "players");
  const nameRef = useRef("");
  const prizeRef = useRef("");

  const getUserList = async () => {
    const data = query(namesCollectionRef, orderBy("time", "asc"));
    const dataSnapshot = await getDocs(data);
    setplayerList(
      dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const getLastNumberFromDB = async () => {
    const docRef = doc(db, "playersNumber", "lastNumber");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().lastNumber;
    }
    return 0;
  };

  const setLastNumberDB = async (number) => {
    const lastNumberRef = doc(db, "playersNumber", "lastNumber");
    await updateDoc(lastNumberRef, {
      lastNumber: number,
    });
  };

  const registerNewPlayer = async (
    name,
    playerFirstNumber,
    playerLastNumber
  ) => {
    await addDoc(namesCollectionRef, {
      name,
      firstTicket: playerFirstNumber,
      lastTicket: playerLastNumber,
      time: Date.now(),
    });
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tickets === 0) {
      alert(`Kan ikke kjøpe 0 billeter`);
      return;
    }
    const dbOldLastNumber = await getLastNumberFromDB();
    const playerFirstNumber = dbOldLastNumber + 1;
    const playerLastNumber = playerFirstNumber + tickets - 1;
    await registerNewPlayer(name, playerFirstNumber, playerLastNumber);
    await setLastNumberDB(playerLastNumber);
    setUpdateList(!updateList);
    setName("");
    setTickets("");
  };

  useEffect(() => {
    getUserList();
    nameRef.current.focus();
  }, [updateList]);

  useEffect(() => {}, [playerList]);

  const editPlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const playerToEdit = playerList.filter((player) => player.id === id);
    const remainingPlayers = playerList.filter((player) => player.id !== id);
    await deleteDoc(playerDoc);
    setplayerList(remainingPlayers);
    if (remainingPlayers.length == 0) {
      await setLastNumberDB(0);
    }
    setName(playerToEdit[0].name);
    setTickets(playerToEdit[0].tickets.length);
  };

  const resetList = async (list) => {
    list.map((player) => {
      const { id } = player;
      const playerDoc = doc(db, "players", id);
      deleteDoc(playerDoc);
      setplayerList([]);
      return setLastNumberDB(0);
    });
  };

  const deletePlayer = async (id) => {
    const playerDoc = doc(db, "players", id);
    const remainingPlayers = playerList.filter((player) => player.id !== id);
    await deleteDoc(playerDoc);
    setplayerList(remainingPlayers);
    if (remainingPlayers.length == 0) {
      await setLastNumberDB(0);
    }
  };

  return (
    <main>
      <div className="nav">
        <img src={logo} alt="" className="logo" />

        <Navbar></Navbar>
      </div>
      <h1 className="frontpage-title">MTT Fredags Lotteri</h1>

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
                  ref={nameRef}
                  className="newName name"
                  value={name}
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              {showModal && (
                <div>
                  <button
                    className="closeModal"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    X
                  </button>
                  <PictureModal />
                </div>
              )}
              <div>
                <label className="labels">Antall billetter:</label>
                <input
                  value={tickets}
                  className="newName newTickets"
                  required
                  ref={prizeRef}
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
                onClick={() => resetList(playerList)}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="list">
            <div className="list-items-container">
              <List
                playerList={playerList}
                editPlayer={editPlayer}
                deletePlayer={deletePlayer}
              />
            </div>
          </div>
        </div>

        <div className="prize-container">
          <Prizes showModal={showModal} setShowModal={setShowModal}></Prizes>
        </div>
      </div>
    </main>
  );
};

export default Home;
