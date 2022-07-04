import React from "react";
import rewards from "../images/prizes.png";
import { useState } from "react";
import { connectFirestoreEmulator } from "firebase/firestore";

const Prizes = () => {
  const addNewPrize = () => {};

  const [prizeList, setPrizeList] = useState([]);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [newPrize, setNewPrize] = useState("");

  return (
    <div>
      <img src={rewards} alt="prizes" />
      <h2 className="prize-title">Premier:</h2>
      <div className="prize-list">
        <form
          className="form prize-form"
          onSubmit={(e) => {
            addNewPrize(e);
          }}
        >
          <label className="labels">Premie:</label>
          <input
            type="text"
            value={newPrize}
            className="input prize-input"
            onChange={(e) => {
              setNewPrize(e.target.value);
            }}
          />
          <button className="btn btn-prize" type="submit">
            Legg til ny premie
          </button>
        </form>
        <div className="prize-list-container">
          {prizeList.length > 0 &&
            prizeList.map((prize) => {
              return console.log(prize);
            })}
        </div>
      </div>
    </div>
  );
};

export default Prizes;
