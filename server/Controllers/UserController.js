const User = require("../Schemas/User");
const { sendOtpEmail } = require("../utils/brevoMailer");

const otpStore = require("../utils/otpStore");
const jwt = require("jsonwebtoken");  

// 📌 SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ ok: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;

    otpStore[email] = { otp, expires };

    await sendOtpEmail({
      to: email,
      subject: "Your Seller Login OTP",
      html: `
        <h3>Your Seller Login OTP</h3>
        <p style="font-size:22px;font-weight:bold">${otp}</p>
        <p>Valid for 5 minutes</p>
      `,
    });

    res.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    console.error("SELLER OTP ERROR:", err.response?.data || err.message);
    res.status(500).json({ ok: false, message: "Error sending OTP" });
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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role, // 🔥 REQUIRED
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: false, // true in production HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (user.role === "admin") {
      res
        .cookie("admin_token", token, cookieOptions)
        .json({ ok: true, role: "admin" });
    } else {
      res
        .cookie("token", token, cookieOptions)
        .json({ ok: true, role: user.role });
    }
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
