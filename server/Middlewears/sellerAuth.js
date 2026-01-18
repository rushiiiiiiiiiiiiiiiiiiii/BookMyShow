const jwt = require("jsonwebtoken");

module.exports = function sellerAuth(req, res, next) {
  const token = req.cookies.seller_token;

  if (!token) {
    return res.status(401).json({ ok: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return res.status(403).json({ ok: false });
    }

    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({ ok: false });
  }
};
