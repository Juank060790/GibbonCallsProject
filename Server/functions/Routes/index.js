var express = require("express");
var router = express.Router();

// Routes to Apis

// authApi
const authApi = require("./authApi");
router.use("/user", authApi);

// Audio
const audioApi = require("./audioApi");
router.use("/audio", audioApi);

// Calls
const callsApi = require("./callsApi");
router.use("/calls", callsApi);

// Fake Test
const fakeDataApi = require("./fakeDataApi");
router.use("/fake", fakeDataApi);

module.exports = router;
