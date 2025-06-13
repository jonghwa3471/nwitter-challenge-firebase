// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQoiwWYskp4DIfqp-tZU15CpAfs0ph3RU",
  authDomain: "nwitter-challenge.firebaseapp.com",
  projectId: "nwitter-challenge",
  storageBucket: "nwitter-challenge.firebasestorage.app",
  messagingSenderId: "811606743001",
  appId: "1:811606743001:web:30c4c6289fca162b086bc8",
  measurementId: "G-P9V70SG3LX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

// const analytics = getAnalytics(app);
