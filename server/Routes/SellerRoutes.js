const router = require("express").Router();
const {
  sendOtp,
  verifyOtp,
  onboard,
  getMe,
  getSellerBookings,
  logout,
  getSellerMe,
} = require("../Controllers/SellerController");

const auth = require("../Middlewears/auth");
const sellerAuth = require("../Middlewears/sellerAuth");

router.post("/logout", logout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/onboard", sellerAuth, onboard);
router.get("/me", sellerAuth, getSellerMe);

router.get("/bookings", sellerAuth, getSellerBookings);

module.exports = router;
