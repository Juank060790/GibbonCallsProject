var express = require("express");
var router = express.Router();

// authApi
const authApi = require("./authApi");
router.use("/user", authApi);

// Audio
const audioApi = require("./audioApi");
router.use("/audio", audioApi);

module.exports = router;
