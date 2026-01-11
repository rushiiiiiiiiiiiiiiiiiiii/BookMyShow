const mongoose = require("mongoose");

const TheatreSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    name: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    address: { type: String, required: true },

    contactEmail: String,
    contactPhone: String,

    brand: String, // Example: PVR, INOX, Cinepolis
    theatreType: {
      type: String,
      enum: ["Single Screen", "Multiplex", "IMAX", "Drive-In"],
      default: "Multiplex",
    },

    openingTime: String,
    closingTime: String,

    amenities: [String], // Parking, Wheelchair, F&B

    location: {
      lat: Number,
      lng: Number,
    },

    slug: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["approved", "blocked"],
      default: "approved",
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theatre", TheatreSchema);
