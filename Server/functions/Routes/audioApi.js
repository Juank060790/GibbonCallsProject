const express = require("express");
const router = express.Router();
const {
  getSingleAudio,
  createSingleAudio,
  deleteSingleAudio,
  getFilteredAudioList,
  addCommentRawAudio,
  deleteSingleCallId,
  deleteCommentAudio,
} = require("../Controllers/Audio");
const FBAuth = require("../Utils/fbauth");

/**
 * @route GET
 * @description Get full filtered Audio List
 * @access  private
 */
router.get("/audiolist/filter/:limit/:sortBy/:order", getFilteredAudioList);

/**
 * @route Get
 * @description Get single audio
 * @access  private
 */
router.get("/audiolist/:audioId", FBAuth, getSingleAudio);

/**
 * @route POST
 * @description Create Single Audio
 * @access  private
 */
router.post("/createaudio", FBAuth, createSingleAudio);

/**
 * @route DELETE
 * @description Delete single audio file
 * @access  private
 */
router.delete("/deletesingleaudio/:audioId", FBAuth, deleteSingleAudio);

/**
 * @route PUT
 * @description Add comment to RawAudio
 * @access  private
 */
router.put("/audiolist/addcomment/:audioId", FBAuth, addCommentRawAudio);

/**
 * @route PUT
 * @description Add comment to RawAudio
 * @access  private
 */
router.put("/audiolist/deletecomment/:audioId", FBAuth, deleteCommentAudio);

module.exports = router;

// /**
//  * @route DELETE
//  * @description Delete single audio call id
//  * @access  private
//  */
// router.delete("/deletesinglecallid", FBAuth, deleteSingleCallId);
