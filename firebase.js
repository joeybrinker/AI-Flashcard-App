// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTU1zwx_6Ck_qUdftTNlJGebwtuPZ8xAk",
  authDomain: "flashcard-saas-7709b.firebaseapp.com",
  projectId: "flashcard-saas-7709b",
  storageBucket: "flashcard-saas-7709b.appspot.com",
  messagingSenderId: "365986784806",
  appId: "1:365986784806:web:8a7ae7b4c84cef428328e7",
  measurementId: "G-DPHFZHF3EG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}
