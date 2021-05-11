import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8TEMZYOeF1gFAbVDwiqqE0h8GfSL4kCk",
  authDomain: "coderschool-project-gibbon.firebaseapp.com",
  databaseURL: "https://coderschool-project-gibbon-default-rtdb.firebaseio.com",
  projectId: "coderschool-project-gibbon",
  storageBucket: "coderschool-project-gibbon.appspot.com",
  messagingSenderId: "591790114188",
  appId: "1:591790114188:web:288819c209bcabe9efc2a9",
  measurementId: "G-6X65GQ4HSG",
};

export const myFirebase = firebase.initializeApp(firebaseConfig);

const baseDb = myFirebase.firestore();

export const db = baseDb;
