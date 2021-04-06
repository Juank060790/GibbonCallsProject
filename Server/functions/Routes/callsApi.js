const express = require("express");
const router = express.Router();
const FBAuth = require("../Utils/fbauth");
const {
  getCallsSingleAudio,
  deleteSingleCall,
} = require("../Controllers/Calls");

// CALLS

/**
 * @route Get
 * @description Get Calls of a single audio
 * @access  private
 */
router.get("/:callId", FBAuth, getCallsSingleAudio);

/**
 * @route DELETE
 * @description Delete Single Call
 * @access  private
 */
router.delete("/deletecall//:callId", FBAuth, deleteSingleCall);

module.exports = router;
