import React from "react";
import { useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";

function Rewards({ updateState, updateStateFunc, setShowModal, ShowModal }) {
  const [currentPrize, setCurrentPrize] = useState("");
  const storage = getStorage();

  const getPicFromCloud = async () => {
    const data = getDownloadURL(ref(storage, "current-pic")).then((url) => {
      setCurrentPrize(url);
      updateStateFunc(!updateState);
    });
  };

  useEffect(() => {
    getPicFromCloud();
  }, []);

  return (
    <div className="pic-container">
      <img
        src={`${currentPrize}`}
        className="current-prizes-pic"
        onClick={() => {
          setShowModal(true);
        }}
      />
    </div>
  );
}

export default Rewards;
