import React from "react";
import rewards from "../images/prizes.png";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

const Prizes = () => {
  const [prizeList, setPrizeList] = useState([]);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [newPrize, setNewPrize] = useState("");
  const [PrizesPic, setPrizesPic] = useState(rewards);
  const prizesCollectionRef = collection(db, "prizes");

  useEffect(() => {
    const getPrizes = async () => {
      const data = query(prizesCollectionRef, orderBy("number", "asc"));
      const dataSnapshot = await getDocs(data);
      setPrizeList(
        dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    return () => {
      getPrizes();
      console.log("prize call made");
    };
  }, [prizeNumber]);

  const addNewPrize = async (e) => {
    e.preventDefault();
    await addDoc(prizesCollectionRef, {
      prizeName: newPrize,
      number: prizeNumber,
    });
    setPrizeNumber(prizeNumber + 1);
    setNewPrize("");
  };

  const editPrize = async (id, prizeName) => {
    const prizeDoc = doc(db, "prizes", id);
    console.log(prizeDoc);
  };

  return (
    <div className="prize">
      <img src={PrizesPic} alt="prize-pic" className="prize-pic" />
      <div className="prize-list-input">
        <form
          className="form prize-form"
          onSubmit={(e) => {
            addNewPrize(e);
          }}
        >
          <label className="labels">Ny Premie:</label>
          <input
            type="text"
            value={newPrize}
            className="input prize-input"
            onChange={(e) => {
              setNewPrize(e.target.value);
              console.log(e.target.value);
            }}
          />
          <button className="btn btn-prize" type="submit">
            Legg til ny premie
          </button>
        </form>
        <div className="prize-list-container">
          <div className="prize-list">
          <h2>Premie Liste:</h2>
          {prizeList.length > 0 &&
            prizeList.map((prize) => {
              const { prizeName, number, id } = prize;
              return (
                <div className="prize-item" key={id}>
                  <h2>{number} : </h2>
                  <h2>{prizeName}</h2>
                  <div className="icons prize-icons">
                    <button className="edit-btn">
                      <FaEdit
                        className="edit"
                        onClick={() => {
                          editPrize(id, prizeName);
                        }}
                      />
                    </button>
                    <button className="delete-btn">
                      <FaTrash className="delete" onClick={() => {}} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Prizes;
