const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");
const { v4: uuidv4 } = require("uuid");

// GOOGLE STORAGE

// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// // The ID of your GCS bucket
// const bucketName = "coderschool-project-gibbon.appspot.com";

// // The ID of your GCS file
// const fileName = "19700101_194149.WAV";
// const { Storage } = require("@google-cloud/storage");

// // Imports the Google Cloud client library

// // Creates a client
// const storage = new Storage();

// async function generateSignedUrl() {
//   // These options will allow temporary read access to the file
//   const options = {
//     version: "v4", // defaults to 'v2' if missing.
//     action: "read",
//     expires: Date.now() + 1000 * 60 * 60, // one hour
//   };

//   // Get a v2 signed URL for the file
//   const [url] = await storage
//     .bucket(bucketName)
//     .file(fileName)
//     .getSignedUrl(options);

//   console.log(`The signed url for ${fileName} is ${url}.`);
// }

// Get SINGLE call from Raw Audio.
exports.getCallsSingleAudio = (req, res) => {
  let singleCall = {};
  db.doc(`calls/${req.params.callId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        singleCall = doc.data();
        // generateSignedUrl();
        console.log(`singleCall`, singleCall);
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
