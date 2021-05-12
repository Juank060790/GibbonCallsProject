// Initialize fierbase

var admin = require("firebase-admin");

var serviceAccount = require("../credential.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coderschool-project-gibbon-default-rtdb.firebaseio.com",
});
const db = admin.firestore();

module.exports = { admin, db };
