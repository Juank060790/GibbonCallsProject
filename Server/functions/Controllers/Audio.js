const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");

// Get single audio from firestore.
exports.getSingleAudio = (req, res) => {
  let singleAudio = {};
  db.doc(`rawData/${req.params.audioId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        singleAudio = doc.data();

        return res.json(singleAudio);
      } else {
        return res.status(404).json({ error: "Audio not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete Raw Audio
exports.deleteSingleAudio = (req, res) => {
  console.log(`req.body`, req.params);
  db.collection("rawData")
    .doc(`${req.params.audioId}`)
    .update({
      isDeleted: true,
    })
    .then(() => {
      return res.status(201).json("Audio deleted successfully ");
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

// Create a single Raw Audio document in firestore
exports.createSingleAudio = (req, res) => {
  const createAudio = {
    audioId: req.body.audioId,
    audioLink: req.body.audioLink,
    comments: req.body.comments,
    duration: req.body.duration,
    fileName: req.body.fileName,
    gibbonCalls: req.body.gibbonCalls,
    gibbonCallsList: req.body.gibbonCallList,
    recordDate: req.body.recordDate,
  };

  db.doc(`/rawData/${createAudio.audioId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userName: "this audio can not be added" });
      } else {
        return db.doc(`/rawData/${createAudio.audioId}`).set(createAudio);
      }
    })
    .then(() => {
      return res
        .status(201)
        .json({ createAudio: "Audio was created successfully " });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

// Get List of Raw Audios for the table in the dashboard, edit filters.

exports.getFilterByDate = (req, res) => {
  let query = {
    limit: parseInt(req.params.limit) || 10,
    sortBy: req.params.sortBy || "recordDate",
    order: req.params.order || "desc",
    page: req.params.page || 0,
  };

  db.collection("rawData")
    .where("isDeleted", "==", false)
    .orderBy(query.sortBy, query.order)
    .limit(query.limit)
    .offset(query.page * query.limit)
    .get()
    .then((data) => {
      if (data) {
        let filteredaudioList = [];
        data.forEach((doc) => {
          filteredaudioList.push(doc.data());
        });
        return res.json(filteredaudioList);
      } else {
        return res.status(404).json({ error: "Audio list not found" });
      }
    })
    .catch((err) => console.error(err));
};

// OnSnapshot

// exports.getFilterByDate = (req, res) => {
//   let query = {
//     limit: parseInt(req.params.limit) || 10,
//     sortBy: req.params.sortBy || "recordDate",
//     order: req.params.order || "desc",
//     page: req.params.page || 0,
//   };

//   const queryDatabase = db
//     .collection("rawData")
//     .where("isDeleted", "==", false)
//     .orderBy(query.sortBy, query.order)
//     .limit(query.limit)
//     .offset(query.page * query.limit);

//   queryDatabase.onSnapshot((querySnapshot) => {
//     console.log(`Received query snapshot of size ${querySnapshot.size}`);
//     if (querySnapshot) {
//       let filteredaudioList = [];
//       querySnapshot.forEach((doc) => {
//         filteredaudioList.push(doc.data());
//       });
//       console.log(`filteredaudioList`, filteredaudioList);
//       return res.json(filteredaudioList);
//     } else {
//       return res.status(404).json({ error: "Audio list not found" });
//     }
//   });
// };
// (err) => {
//   console.log(`Encountered error: ${err}`);
// };

// Add comment to Raw Audio.
exports.addCommentRawAudio = (req, res) => {
  let comment = req.body.comment;
  let audioId = req.body.audioId;
  db.collection("rawData")
    .doc(`${audioId}`)
    .update({
      comments: comment,
    })
    .then(() => {
      return res.status(201).json("Comment was created successfully ");
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

// Delete Comment from single audio from firestore
exports.deleteCommentAudio = (req, res) => {
  db.collection("rawData")
    .doc(`${req.params.audioId}`)
    .update({
      comments: "",
    })
    .then(() => {
      return res.status(200).json("Comment successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};
