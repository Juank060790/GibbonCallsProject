const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");
const { v4: uuidv4 } = require("uuid");

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
        return res.status(404).json({ error: "Call not found" });
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
      return res.status(200).json("Call successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};

// Create Single Call

exports.createSingleCall = (req, res) => {
  const callId = uuidv4();
  const createSingleCall = {
    callId: callId,
    timeStart: req.body.timeStart,
    timeEnd: req.body.timeEnd,
    spectogram: req.body.spectogram,
    label: req.body.label,
    comment: req.body.comment,
  };

  db.doc(`/calls/${createSingleCall.callId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json("this call can not be added");
      } else {
        return db
          .doc(`/calls/${createSingleCall.callId}`)
          .set(createSingleCall);
      }
    })
    .then(() => {
      return res
        .status(201)
        .json({ createAudio: "Call was created successfully " });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

// Add comment to Call
exports.addCommentSingleCall = (req, res) => {
  let comment = req.body.comment;
  let callId = req.body.callId;
  db.collection("calls")
    .doc(`${callId}`)
    .update({
      comment: comment,
    })
    .then(() => {
      return res.status(201).json("Comment was created successfully ");
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

// Delete Comment from single call from firestore
exports.deleteCommentCall = (req, res) => {
  db.collection("calls")
    .doc(`${req.params.callId}`)
    .update({
      comment: "",
    })
    .then(() => {
      return res.status(200).json("Comment successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};
