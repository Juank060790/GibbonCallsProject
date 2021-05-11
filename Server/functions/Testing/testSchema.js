const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");
const faker = require("faker");

const createSingleCall = (req, res) => {
  // const callId = uuidv4();
  const createSingleCall = {
    callId: callIdFake,
    timeStart: getRandomDuration(1, 2),
    timeEnd: getRandomDuration(2, 4),
    spectogram:
      "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/calls%2Fgibbon-call-1.png?alt=media",
    label: pickRandomProperty(),
    comment: faker.lorem.text(),
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
    });
  // .catch((err) => {
  //   return res.status(500).json({ error: err.code });
  // });
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDuration(min, max) {
  min = Math.random() * (3 - min) + min;
  max = Math.random() * (max - min) + min;
  // var number = Math.floor(Math.random() * (max - min + 1)) + min;
  var result = Math.floor(min) + ":" + Math.floor(max);
  console.log(`result`, result);
  return result;
}

const label = { 0: "male", 1: "female" };

function pickRandomProperty(label) {
  var result;
  var count = 0;
  for (var prop in label) if (Math.random() < 1 / ++count) result = prop;
  return result;
}

exports.createSingleFakeAudio = async (req, res) => {
  const audioNum = 20;
  const callIdFake = faker.datatype.uuid();
  for (let i = 0; i < audioNum; i++) {
    const createAudio = {
      audioId: faker.datatype.uuid(),
      audioLink: faker.image.imageUrl(),
      comments: faker.lorem.text(),
      duration: getRandomDuration(1, 59),
      fileName: faker.datatype.uuid(),
      gibbonCalls: getRandomInt(0, 10),
      recordDate: faker.datatype.datetime(),
      isDeleted: false,
      gibbonCallsList: [callIdFake],
    };
    console.log(`createAudio`, createAudio);
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
  }
};
