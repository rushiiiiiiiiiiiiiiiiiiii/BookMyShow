const router = require("express").Router();
const { sendOtp, verifyOtp, onboard, getMe} = require("../controllers/sellerController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/onboard", onboard);
router.get("/me", getMe);

module.exports = router;
