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
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

const Prizes = () => {
  const [prizeList, setPrizeList] = useState([]);
  const [newPrizeNumber, setNewPrizeNumber] = useState("");
  const [newPrizeName, setNewPrizeName] = useState("");
  const [PrizesPic, setPrizesPic] = useState(rewards);
  const [updatePrizeList, setUpdatePrizeList] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const prizesCollectionRef = collection(db, "prizes");

  
  const getPrizes = async () => {
    const data = query(prizesCollectionRef, orderBy("number", "asc"));
    const dataSnapshot = await getDocs(data);
    setPrizeList(
      dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };
  

  const deletePrize = async(id) =>{
    const prizeRef = doc(db,"prizes",id);
    const remainingPrizes = prizeList.filter(prize => prize.id !== id);
    await deleteDoc(prizeRef);
    setPrizeList(remainingPrizes);
  }

  useEffect(() => {  
      getPrizes();
      console.log("prize call made");
  }, [updatePrizeList]);

  const addNewPrize = async (e) => {
    e.preventDefault();
    console.log(typeof(Number(newPrizeNumber)));
    if(isNaN(Number(newPrizeNumber))){
      alert(`Premienummer må være et tall`)
      return
    }
    if (newPrizeName == '' || newPrizeNumber == ''){
      return 
    }   
    else {
      await addDoc(prizesCollectionRef, {
        prizeName: newPrizeName,
        number: Number(newPrizeNumber),
      });
      setNewPrizeName("");
      setNewPrizeNumber("");
      setUpdatePrizeList(!updatePrizeList)
    }
  
}

  const editPrize = async (id, prizeName) => {
    const prizeDoc = doc(db, "prizes", id);
    setIsEditing(true)
    console.log(id)
  };

  const submitEditedPrize = async (e) =>{
    e.preventDefault();
    console.log('submitted')
    setIsEditing(false)
  }

  return (
    <div className="prize">
      <img src={PrizesPic} alt="prize-pic" className="prize-pic" />
      <div className="prize-list-input">
        <form
          className="form prize-form"
          onSubmit={(e) => {
            {isEditing? submitEditedPrize(e) : addNewPrize(e)}
            
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
          <button className={isEditing? 'btn edit-btn-prize':'btn btn-prize'} type="submit">
            {isEditing? 'Rediger premie': 'Legg til ny premie'}
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
                      <FaTrash className="delete" onClick={() => {deletePrize(id)}} />
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
