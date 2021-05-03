import firebase from "firebase";

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

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATABASE_URL,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: "coderschool-project-gibbon.appspot.com",
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// };
firebase.initializeApp(firebaseConfig);

export default firebase;
