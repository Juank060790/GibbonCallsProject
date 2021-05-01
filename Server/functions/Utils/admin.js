// Initialize fierbase

const admin = require("firebase-admin");
const serviceAccount = require("../credential.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// const admin = require("firebase-admin");
// admin.initializeApp();
// const db = admin.firestore();

module.exports = { admin, db };
