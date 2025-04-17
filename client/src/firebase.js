// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'



// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyADpmgar-w-urfXEoes5-HRfvPMlYcHuU0",
//   authDomain: "promart-af72e.firebaseapp.com",
//   projectId: "promart-af72e",
//   storageBucket: "promart-af72e.firebasestorage.app",
//   messagingSenderId: "235946377322",
//   appId: "1:235946377322:web:0b8e544001ad687c008a13",
//   measurementId: "G-D8F9JXV6K6"
// };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNARms63FcffG2iXCJJPcdGgbVt9cx_I4",
  authDomain: "siva-2e540.firebaseapp.com",
  databaseURL: "https://siva-2e540-default-rtdb.firebaseio.com",
  projectId: "siva-2e540",
  storageBucket: "siva-2e540.appspot.com",
  messagingSenderId: "302272715908",
  appId: "1:302272715908:web:00ee2ef5083e72dbd6f6d1",
  measurementId: "G-Y63472JMWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);



