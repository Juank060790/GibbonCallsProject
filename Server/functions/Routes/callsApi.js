const express = require("express");
const router = express.Router();
const FBAuth = require("../Utils/fbauth");
const {
  getCallsSingleAudio,
  deleteSingleCall,
  createSingleCall,
  addCommentSingleCall,
  deleteCommentCall,
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

/**
 * @route POST
 * @description Create Single Call
 * @access  private
 */
router.post("/createcall", FBAuth, createSingleCall);

/**
 * @route PUT
 * @description Add comment to SingleCall
 * @access  private
 */
router.put("/addcomment/:callId", FBAuth, addCommentSingleCall);

/**
 * @route PUT
 * @description Update comment to empty string
 * @access  private
 */
router.put("/deletecomment/:callId", FBAuth, deleteCommentCall);

module.exports = router;
