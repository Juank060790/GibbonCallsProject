const express = require("express");
const router = express.Router();
const { signup, login, getAuthenticatedUser } = require("../Controllers/users");
const FBAuth = require("../Utils/fbauth");

/**
 * @route POST /login
 * @description LOGIN
 * @access Public
 */
router.post("/login", login);

/**
 * @route POST /signup
 * @description SIGNUP
 * @access Public
 */
router.post("/signup", signup);

/**
 * @route GET /Get Current User
 * @description Get Current User
 * @access Public
 */
router.get("/me", FBAuth, getAuthenticatedUser);

module.exports = router;
