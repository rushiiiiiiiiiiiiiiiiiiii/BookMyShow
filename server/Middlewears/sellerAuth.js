module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({ ok: false, message: "Seller only" });
  }
  next();
};
