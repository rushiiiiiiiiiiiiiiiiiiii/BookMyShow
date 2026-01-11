const User = require("../Schemas/User");
const { sendOtpEmail } = require("../utils/brevoMailer");

const otpStore = require("../utils/otpStore");
const jwt = require("jsonwebtoken");  

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ ok: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 min

    // ✅ STORE AS OBJECT
    otpStore[email] = { otp, expires };

    await sendOtpEmail({
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p style="font-size:24px;font-weight:bold">${otp}</p>
        <p>Valid for 5 minutes</p>
      `,
    });

    res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("USER OTP ERROR:", err.response?.data || err.message);
    res.status(500).json({ ok: false, message: "Error sending OTP" });
  }
};




// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    // ❌ no record or wrong OTP
    if (!record || record.otp !== otp) {
      return res.status(400).json({ ok: false, message: "Invalid OTP" });
    }

    // ⏰ expired
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ ok: false, message: "OTP expired" });
    }

    delete otpStore[email]; // cleanup

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({ email, isVerified: true });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, role: user.role, isNewUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Error verifying OTP" });
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
