const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.cookies.admin_token ||
      req.cookies.seller_token;

    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};
