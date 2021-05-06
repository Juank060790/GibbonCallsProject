const express = require("express");
const router = express.Router();
const { createSingleFakeAudio } = require("../Testing/testSchema");

/**
 * @route POST
 * @description Create Single Audio
 * @access  private
 */
router.post("/createfakeaudio", createSingleFakeAudio);

module.exports = router;
