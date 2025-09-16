const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); 
const { handleSignup, handleLogin, handleLogout, checkAuth } = require('../controllers/auth.controller');
const {protectRoute} = require("../middleware/auth.js");

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/check", protectRoute, checkAuth);


module.exports = router;
