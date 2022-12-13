import React from "react";
import Rewards from "./Rewards";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  deleteDoc,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { FaEdit, FaTrash } from "react-icons/fa";

const Prizes = ({ showModal, setShowModal }) => {
  const [prizeList, setPrizeList] = useState([]);
  const [newPrizeNumber, setNewPrizeNumber] = useState("");
  const [newPrizeName, setNewPrizeName] = useState("");
  const [prizePicState, setPrizePicState] = useState(false);
  const [updatePrizeList, setUpdatePrizeList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const prizesCollectionRef = collection(db, "prizes");
  const storage = getStorage();
  const storageRef = ref(storage, "current-pic");

  const getPrizes = async () => {
    const data = query(prizesCollectionRef, orderBy("number", "asc"));
    const dataSnapshot = await getDocs(data);
    setPrizeList(
      dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const deletePrize = async (id) => {
    const prizeRef = doc(db, "prizes", id);
    const remainingPrizes = prizeList.filter((prize) => prize.id !== id);
    await deleteDoc(prizeRef);
    setPrizeList(remainingPrizes);
  };

  useEffect(() => {
    getPrizes();
  }, [updatePrizeList, prizePicState]);

  const addNewPrize = async (e) => {
    e.preventDefault();
    if (isNaN(Number(newPrizeNumber))) {
      alert(`Premienummer må være et tall`);
      return;
    }
    if (newPrizeName == "" || newPrizeNumber == "") {
      return;
    } else {
      await addDoc(prizesCollectionRef, {
        prizeName: newPrizeName,
        number: Number(newPrizeNumber),
      });
      setNewPrizeName("");
      setNewPrizeNumber("");
      setUpdatePrizeList(!updatePrizeList);
    }
  };

  const editPrize = async (id) => {
    setIsEditing(true);
    const prizeDoc = doc(db, "prizes", id);
    const prizeToEdit = prizeList.filter((prize) => prize.id === id);
    const remainingPrizes = prizeList.filter((prize) => prize.id !== id);
    await deleteDoc(prizeDoc);
    setPrizeList(remainingPrizes);
    setNewPrizeName(prizeToEdit[0].prizeName);
    setNewPrizeNumber(prizeToEdit[0].number);
  };

  const submitEditedPrize = async (e) => {
    e.preventDefault();
    addNewPrize();
    setIsEditing(false);
  };

  const uploadPicToCloud = async (e) => {
    e.preventDefault();
    const NewPic = await uploadBytes(storageRef, e.target.files[0]);
    setPrizePicState(!prizePicState);
  };

  return (
    <div className="prize">
      <form action="/action_page.php">
        Velg bilde:
        <input type="file" onChange={uploadPicToCloud} />
      </form>
      <Rewards
        updateState={prizePicState}
        updateStateFunc={setPrizePicState}
        setShowModal={setShowModal}
        showModal={showModal}
      />
      <div className="prize-list-input">
        <form
          className="form prize-form"
          onSubmit={(e) => {
            {
              isEditing ? submitEditedPrize(e) : addNewPrize(e);
            }
          }}
        >
          <div className="nameCell">
            <div>
              <label className="labels prizeName">Premie Nummer:</label>
              <input
                type="text"
                value={newPrizeNumber}
                className="input prize-input"
                onChange={(e) => {
                  setNewPrizeNumber(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="labels prizeNumber">Premie Navn:</label>
              <input
                type="text"
                value={newPrizeName}
                className="input prize-input"
                onChange={(e) => {
                  setNewPrizeName(e.target.value);
                }}
              />
            </div>
          </div>
          <button
            className={isEditing ? "btn edit-btn-prize" : "btn btn-prize"}
            type="submit"
          >
            {isEditing ? "Rediger premie" : "Legg til ny premie"}
          </button>
        </form>
        <div className="prize-list-container">
          <div className="prize-list">
            <h2>Premie Liste:</h2>
            <table>
              <tr>
                <th>#</th>
                <th>Premie</th>
              </tr>
              {prizeList.length > 0 &&
                prizeList.map((prize) => {
                  const { prizeName, number, id } = prize;
                  return (
                    <tr key={id}>
                      <td>{number}</td>
                      <td>{prizeName}</td>
                      <td>
                        <FaEdit
                          className="edit"
                          onClick={() => {
                            editPrize(id, prizeName);
                          }}
                        />
                      </td>
                      <td>
                        <FaTrash
                          className="delete"
                          onClick={() => {
                            deletePrize(id);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prizes;
