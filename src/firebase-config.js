import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDHIXOihKVOO_Qcah2fIv6hBBzus8qt-go",
  authDomain: "lottery-445c6.firebaseapp.com",
  projectId: "lottery-445c6",
  storageBucket: "lottery-445c6.appspot.com",
  messagingSenderId: "489784841345",
  appId: "1:489784841345:web:a226326866873a7e102980",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
