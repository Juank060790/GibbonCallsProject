const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");

// Get SINGLE call from Raw Audio.
exports.getCallsSingleAudio = (req, res) => {
  let singleCall = {};
  db.doc(`calls/${req.params.callId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        singleCall = doc.data();
        return res.json(singleCall);
      } else {
        return res.status(404).json({ error: "Audio not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete single call from firebase.
exports.deleteSingleCall = (req, res) => {
  db.collection("calls")
    .doc(`${req.params.callId}`)
    .delete()
    .then(() => {
      console.log("Call successfully deleted!");
      return res.status(200).json("Call successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};
