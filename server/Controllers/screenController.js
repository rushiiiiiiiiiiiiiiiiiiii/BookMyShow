const jwt = require("jsonwebtoken");
const Screen = require("../Schemas/Screen");
const Theatre = require("../Schemas/Theatre");

// ✅ Add Screen
exports.addScreen = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { theatreId } = req.params;

    const {
      name,
      rows,
      seatsPerRow,
      screenType,
      projectorType,
      soundSystem,
    } = req.body;

    if (!name || !rows || !seatsPerRow) {
      return res.status(400).json({
        ok: false,
        message: "All required fields missing",
      });
    }

    const theatre = await Theatre.findOne({
      _id: theatreId,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Theatre not owned by you",
      });
    }

    // ✅ Prevent duplicate screen names
    const exists = await Screen.findOne({ theatreId, name });
    if (exists) {
      return res.status(409).json({
        ok: false,
        message: "Screen with this name already exists",
      });
    }

    const screen = await Screen.create({
      theatreId,
      name,
      rows,
      seatsPerRow,
      totalSeats: rows * seatsPerRow,
      screenType,
      projectorType,
      soundSystem,
    });

    res.json({ ok: true, screen });
  } catch (err) {
    console.error("ADD SCREEN ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to add screen",
    });
  }
};

// ✅ Get screens for one theatre
exports.getScreensByTheatre = async (req, res) => {
  try {
    const { theatreId } = req.params;

    const screens = await Screen.find({ theatreId }).sort({ createdAt: 1 });

    res.json({ ok: true, screens });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

// ✅ Seller global screen list
exports.getAllScreens = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Only the seller's theatres
    const theatres = await Theatre.find({ sellerId: decoded.id }).select("_id");
    const theatreIds = theatres.map((t) => t._id);

    const screens = await Screen.find({ theatreId: { $in: theatreIds } })
      .populate("theatreId", "name city")
      .sort({ createdAt: -1 });

    res.json({ ok: true, screens });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};


// ✅ DELETE SCREEN
exports.deleteScreen = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const screen = await Screen.findById(id);
    if (!screen) {
      return res.status(404).json({ ok: false, message: "Screen not found" });
    }

    // ✅ Validate Ownership
    const theatre = await Theatre.findOne({
      _id: screen.theatreId,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Not authorized to delete this screen",
      });
    }

    await Screen.findByIdAndDelete(id);

    res.json({
      ok: true,
      message: "Screen deleted successfully",
    });

  } catch (err) {
    console.error("DELETE SCREEN ERROR:", err);
    res.status(500).json({ ok: false, message: "Failed to delete screen" });
  }
};

// ✅ UPDATE SCREEN
exports.updateScreen = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const {
      name,
      rows,
      seatsPerRow,
      screenType,
      projectorType,
      soundSystem,
    } = req.body;

    const screen = await Screen.findById(id);
    if (!screen) {
      return res.status(404).json({ ok: false, message: "Screen not found" });
    }

    // ✅ Verify ownership
    const theatre = await Theatre.findOne({
      _id: screen.theatreId,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Not authorized to update this screen",
      });
    }

    // ✅ Prevent duplicate name
    const duplicate = await Screen.findOne({
      _id: { $ne: id },
      theatreId: screen.theatreId,
      name,
    });

    if (duplicate) {
      return res.status(409).json({
        ok: false,
        message: "Another screen already uses this name",
      });
    }

    // ✅ Update fields
    screen.name = name || screen.name;
    screen.rows = rows || screen.rows;
    screen.seatsPerRow = seatsPerRow || screen.seatsPerRow;
    screen.totalSeats = screen.rows * screen.seatsPerRow;
    screen.screenType = screenType;
    screen.projectorType = projectorType;
    screen.soundSystem = soundSystem;

    await screen.save();

    res.json({ ok: true, message: "Screen updated successfully", screen });

  } catch (err) {
    console.error("UPDATE SCREEN ERROR:", err);
    res.status(500).json({ ok: false, message: "Failed to update screen" });
  }
};

