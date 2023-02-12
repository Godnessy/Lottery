import React from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
function PictureModal() {
  const [pic, setPic] = useState();
  const storage = getStorage();
  const getPicFromCloud = async () => {
    await getDownloadURL(ref(storage, "current-pic")).then((url) => {
      setPic(url);
    });
  };
  useEffect(() => {
    getPicFromCloud();
  }, []);

  return (
    <div className="modal">
      <img src={pic && pic} alt="big prize pic" className="modal-pic" />
    </div>
  );
}

export default PictureModal;
