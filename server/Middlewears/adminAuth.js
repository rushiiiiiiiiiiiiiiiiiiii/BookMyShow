// middlewares/adminAuth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ ok: false });

    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ ok: false });
  }
};
