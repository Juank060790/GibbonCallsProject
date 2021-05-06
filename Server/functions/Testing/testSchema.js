const { db, admin } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");
const faker = require("faker");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.createSingleFakeAudio = (req, res) => {
  const createAudio = {
    audioId: faker.phone.phoneNumber(),
    audioLink: faker.image.imageUrl(),
    comments: faker.lorem.text(),
    duration: faker.datatype.number(),
    fileName: faker.datatype.uuid(),
    gibbonCalls: getRandomInt(0, 10),
    recordDate: faker.datatype.datetime(),
    isDeleted: faker.datatype.boolean(),
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
};
