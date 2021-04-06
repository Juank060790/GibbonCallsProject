const express = require("express");
const router = express.Router();
const {
  getSingleAudio,
  createSingleAudio,
  deleteSingleAudio,
  getFilteredAudioList,
  addCommentRawAudio,
  deleteSingleCallId,
} = require("../Controllers/Audio");
const FBAuth = require("../Utils/fbauth");

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
 * @route GET
 * @description Get full filtered Audio List
 * @access  private
 */
router.get(
  "/audiolist/filter/:limit/:sortBy/:order/:startDoc",
  FBAuth,
  getFilteredAudioList
);

/**
 * @route PUT
 * @description Add comment to RawAudio
 * @access  private
 */
router.put("/audiolist/addcomment/:audioId", FBAuth, addCommentRawAudio);

module.exports = router;

// /**
//  * @route DELETE
//  * @description Delete single audio call id
//  * @access  private
//  */
// router.delete("/deletesinglecallid", FBAuth, deleteSingleCallId);
