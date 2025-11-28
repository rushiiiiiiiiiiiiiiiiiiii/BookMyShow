const express = require("express");
const Authrouter = express.Router();
const {
  sendOtp,
  verifyOtp,
  setName,
  getMe,
} = require("../Controllers/UserController");
const auth = require("../Middlewears/authMiddleware");

Authrouter.post("/send-otp", sendOtp);
Authrouter.post("/verify-otp", verifyOtp);
Authrouter.post("/set-name", auth, setName);
Authrouter.get("/me", auth, getMe);
module.exports = Authrouter;
