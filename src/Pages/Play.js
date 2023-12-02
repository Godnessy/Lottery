import React from "react";
import { useState, useEffect, useRef } from "react";
import Navbar from "../Components/Navbar";
import "./Play.css";
import logo from "../images/mtt_logo.png";
import santa_hat from "../images/santa-hat.png";
import { db } from "../firebase-config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Rewards from "../Components/Rewards";
import List from "../Components/List";

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
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  const leftPosition = isFirefox ? 180 : 180;

  const [winningNumbers, setwinningNumbers] = useState([]);

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

  function createRandomNumber(maxNumber, winningNumbers) {
    let randomNumber = Math.trunc(Math.random() * maxNumber) + 1;
    if (winningNumbers.includes(randomNumber)) {
      return createRandomNumber(maxNumber, winningNumbers);
    } else {
      setwinningNumbers([...winningNumbers, randomNumber]);
      return randomNumber;
    }
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

  function handleWinner(
    winnerName,
    prizeId,
    prizeNumber,
    prizeName,
    winningNumber
  ) {
    setWinnerBanner("");
    const prizeWinnerEle = prizeWinnerRef.current.filter((prize) => {
      return prize.classList[0].split("-")[1] == prizeId;
    });
    const winnerLine = `🥳🥳${winnerName} vinner premie nummer ${prizeNumber}: ${prizeName} 🥳🥳`;
    const winnerTimeOut = setTimeout(() => {
      setWinnerBanner(winnerLine);
      prizeWinnerEle[0].textContent = `${winningNumber}:${winnerName}`;
    }, 2500);
  }

  function startRound(playerList) {
    const currentPrize =
      prizePool.length > 0
        ? prizePool[0]
        : setWinnerBanner(`Alle premiene tildelt.`);
    const prizeId = currentPrize[0];
    if (prizePool.length == 0) {
      setWinnerBanner(`Laster premie listen,prøv igjen om 10 sekunder`);
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
        randomNumber = createRandomNumber(lastNumber, winningNumbers);
        winner = playerList.filter((player) => {
          return (
            player.firstTicket <= randomNumber &&
            player.lastTicket >= randomNumber
          );
        });
        const winnerName = winner[0].name;
        randomNumberAnimation(randomNumber);
        handleWinner(winnerName, prizeId, prizeNumber, prizeName, randomNumber);
      }
    }
    prizePool.shift();
    const activePrizeTimeOut = setTimeout(() => {
      handleActivePrize(prizeId, false);
    }, 5000);
    return clearTimeout(activePrizeTimeOut);
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
      <h1 className="title">Ønsker dere alle en God Jul!</h1>
      <div className="container">
        <div className=" play-list">
          <img className="santa-hat" src={santa_hat} alt="Santa Hat" />
          <List playerList={playerList} isPlaying={false} />
        </div>
        <div className="game-container">
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
          <div className="winnerAlert">
            {winnerBanner !== "" && winnerBanner}
          </div>
        </div>

        <div className="play-prize-list">
          <div className="rewards">
            <img
              className="santa-hat-prize"
              style={{ left: `${leftPosition}px` }}
              src={santa_hat}
              alt="Santa Hat pic"
            />
            <Rewards />
          </div>
          <div className="inside-prize-list">
            <h2 className="prize-list-title">Premie Liste:</h2>
            <table>
              <tr>
                <th>#</th>
                <th>Premie</th>
              </tr>
              {prizeList.length > 0 &&
                prizeList.map((prize) => {
                  const { prizeName, number, id } = prize;
                  return (
                    <>
                      {" "}
                      <tr key={id}>
                        <td>{number}</td>
                        <td>{prizeName}</td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <p
                            className={`winner-${id} winner-el`}
                            ref={addWinnersIdToRef}
                          ></p>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Play;
