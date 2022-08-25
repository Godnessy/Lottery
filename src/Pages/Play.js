import React from "react";
import { useState, useEffect, useRef } from "react";
import List from "../Components/List";
import Prizes from "../Components/Prizes";
import Navbar from "../Components/Navbar";
import { GiCheckMark } from "react-icons/gi";
import "./Play.css";
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

const Play = () => {
  const [playerList, setplayerList] = useState([]);
  const [prizeList, setPrizeList] = useState([]);
  const [randomNumber, setRandomNumber] = useState(null);
  const [prizePool, setPrizePool] = useState([]);
  const [winnerBanner, setWinnerBanner] = useState("");
  const namesCollectionRef = collection(db, "players");
  const prizesCollectionRef = collection(db, "prizes");
  const lotteryRandomNumber = document.querySelector(".winning-number");
  const prizeWinnerRef = useRef([]);
  prizeWinnerRef.current = [];

  const getPlayerList = async () => {
    const data = query(namesCollectionRef, orderBy("time", "asc"));
    const dataSnapshot = await getDocs(data);
    setplayerList(
      dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const getPrizes = async () => {
    const data = query(prizesCollectionRef, orderBy("number", "asc"));
    const dataSnapshot = await getDocs(data);
    setPrizeList(
      dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  useEffect(() => {
    getPlayerList();
    getPrizes();
    console.log(`useeffect call made`);
  }, []);

  useEffect(() => {
    setPrizePool(
      prizeList.map((prize) => {
        return [prize.id, prize.number, prize.prizeName];
      })
    );
  }, [prizeList]);

  useEffect(() => {}, [winnerBanner]);

  function handleActivePrize(prizeId, add) {
    const activePrize = prizeWinnerRef.current.filter((prize) => {
      return prize.classList[0].split("-")[1] == prizeId;
    })[0];
    const parentDiv = activePrize.parentNode;
    if (add) {
      parentDiv.classList.add("active");
    } else if (!add) {
      parentDiv.classList.remove("active");
    }
  }

  function createRandomNumber(maxNumber) {
    return Math.trunc(Math.random() * Math.random() * maxNumber) + 1;
  }

  const delayBetweenRandomNumbers = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  async function randomNumberAnimation(winningNumber) {
    let i = 0;
    while (i < 20) {
      const randomNumber = Math.trunc(Math.random() * Math.random() * 100) + 1;
      lotteryRandomNumber.textContent = randomNumber;
      await delayBetweenRandomNumbers(100);
      i++;
    }
    setRandomNumber(winningNumber);
  }

  function handleWinner(winnerName, prizeId, prizeNumber, prizeName) {
    const prizeWinnerEle = prizeWinnerRef.current.filter((prize) => {
      return prize.classList[0].split("-")[1] == prizeId;
    });
    const winnerLine = `🥳🥳${winnerName} vinner premie nummer ${prizeNumber}: ${prizeName} 🥳🥳`;
    setTimeout(() => {
      setWinnerBanner(winnerLine);
      setTimeout(() => {
        setWinnerBanner("");
      }, 5000);
      prizeWinnerEle[0].textContent = `${winnerName}🥳`;
    }, 2500);
  }

  function startRound(playerList) {
    const currentPrize =
      prizePool.length > 0
        ? prizePool[0]
        : setWinnerBanner(`Alle premiene tildelt.`);
    const prizeId = currentPrize[0];
    if (prizePool.length == 0) {
      setWinnerBanner(`Laster premie listen`);
      setTimeout(() => {
        setWinnerBanner("");
      }, 3000);
    } else {
      const prizeNumber = currentPrize[1];
      const prizeName = currentPrize[2];
      handleActivePrize(prizeId, true);
      const lastNumber = playerList[playerList.length - 1].lastTicket;
      let winner = [];
      let randomNumber;
      while (winner.length == 0) {
        randomNumber = createRandomNumber(lastNumber);
        winner = playerList.filter((player) => {
          return (
            player.firstTicket <= randomNumber &&
            player.lastTicket >= randomNumber
          );
        });
      }
      const winnerName = winner[0].name;
      randomNumberAnimation(randomNumber);
      handleWinner(winnerName, prizeId, prizeNumber, prizeName);
    }
    prizePool.shift();
    setTimeout(() => {
      handleActivePrize(prizeId, false);
    }, 5000);
  }

  function addWinnersIdToRef(el) {
    if (el && !prizeWinnerRef.current.includes(el)) {
      prizeWinnerRef.current.push(el);
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
                  <p className="numbers">{`${firstTicket} - ${lastTicket}`}</p>
                </div>
              );
            })}
        </div>
        <div className="game-container">
          <div className="winnerAlert">
            {winnerBanner !== "" && winnerBanner}
          </div>

          <div className="game-number">
            <p className="win-title">Vinner Tall:</p>
            <p className="winning-number">{randomNumber}</p>
          </div>
          <div className="game-button">
            <button
              className="start-game"
              onClick={() => {
                startRound(playerList, prizeList);
              }}
            >
              Spill
            </button>
          </div>
        </div>

        <div className="play-prize-list">
          {prizeList.length > 0 &&
            prizeList.map((prize) => {
              const { prizeName, number, id } = prize;
              return (
                <div className="individual-prize-container" key={id}>
                  <div className={`prize-item ${id}`}>
                    <p className="checkMark">
                      {" "}
                      <GiCheckMark />
                    </p>
                    <h2 className={`prizeNumber-${id}`}>{number} : </h2>
                    <h2 className={`prizeName-${id}`}>{prizeName}</h2>
                    <p className="checkMark">
                      {" "}
                      <GiCheckMark />
                    </p>
                  </div>
                  <p
                    className={`winner-${id} winner-el`}
                    ref={addWinnersIdToRef}
                  ></p>
                  <hr
                    style={{
                      width: 100,
                    }}
                  />
                </div>
              );
            })}{" "}
        </div>
      </div>
    </main>
  );
};

export default Play;
