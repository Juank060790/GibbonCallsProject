// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client using Application Default Credentials
// const storage = new Storage();

// Creates a client from a Google service account key
const storage = new Storage({ keyFilename: "credential.json" });
const bucket = storage.bucket("coderschool-project-gibbon.appspot.com");
const file = bucket.file("19700101_194149.WAV");

console.log(`file`, file.name);

/**
 * TODO(developer): Uncomment these variables before running the **/
