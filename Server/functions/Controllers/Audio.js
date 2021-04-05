const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");

exports.getSingleAudio = (req, res) => {
  let singleAudio = {};
  db.doc(`rawData/${req.params.audioId}`)
    .get()
    .then((doc) => {
      // console.log("DOOOCCC", doc);
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

exports.deleteSingleAudio = (req, res) => {
  db.collection("rawData")
    .doc(`${req.params.audioId}`)
    .delete()
    .then(() => {
      console.log("Audio successfully deleted!");
      return res.status(200).json("Audio successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};

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

exports.getFilteredAudioList = (req, res) => {
  let query = {
    startDoc: req.params.startDoc || 0,
    limit: req.params.limit,
    sortBy: req.params.sortBy || "recordDate",
    order: req.params.order || "desc",
  };

  // const startIndex = (query.page - 1) * query.limit;
  // let latestDoc = query.latestDoc;

  console.log("request after", query, "PAGEEE AUDIOID");

  // const batch = db.batch();
  // batch.set();

  // const endIndex = query.page * index;

  sortBy = query.sortBy;
  order = query.order;
  startDoc = query.startDoc;
  limit = parseInt(query.limit) || 10;
  console.log("STARTDOC", startDoc);
  db.collection("rawData")
    .orderBy(sortBy, order)
    .startAfter(startDoc)
    .limit(limit)
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

exports.addCommentRawAudio = (req, res) => {
  let comment = req.body.comments;
  db.collection("rawData")
    .doc(`${req.params.audioId}`)
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

// SINGLE CALLS

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
