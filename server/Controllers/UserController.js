const User = require("../Schemas/User");
const transporter = require("../utils/Mail");
const otpStore = require("../utils/otpStore");
const jwt = require("jsonwebtoken");

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.json({ ok: false, message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await transporter.sendMail({
      from: `"BookMyShow Clone" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p style="font-size: 24px; font-weight: bold;">${otp}</p>
        <p>Do not share this code with anyone.</p>
      `,
    });

    res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    res.json({ ok: false, message: "Error sending OTP" });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (otpStore[email] !== otp)
      return res.json({ ok: false, message: "Invalid OTP" });

    let user = await User.findOne({ email });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await User.create({
        email,
        isVerified: true,
      });
    }

    delete otpStore[email];

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: false, // cannot be accessed by JS
        secure: false, // true only on HTTPS (local dev = false)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ ok: true, isNewUser });
  } catch (err) {
    console.log(err);
    res.json({ ok: false, message: "Error verifying OTP" });
  }
};

// SET NAME
exports.setName = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name;
    user.isVerified = true;

    await user.save();

    res.json({ ok: true, user });
  } catch (err) {
    console.log(err);
    res.json({ ok: false, message: "Error saving name" });
  }
};

// GET LOGGED-IN USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ ok: true, user });
  } catch (err) {
    res.json({ ok: false, message: "User not found" });
  }
};
