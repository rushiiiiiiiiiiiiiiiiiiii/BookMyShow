const mongoose = require("mongoose");

const ScreenSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rows: {
      type: Number,
      required: true,
    },

    seatsPerRow: {
      type: Number,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
    },

    screenType: {
      type: String,
      enum: ["Regular", "Luxury", "Recliner", "IMAX"],
      default: "Regular",
    },

    projectorType: {
      type: String,
      enum: ["Digital", "Laser", "4K"],
      default: "Digital",
    },

    soundSystem: {
      type: String,
      enum: ["Dolby 7.1", "Dolby Atmos", "DTS"],
      default: "Dolby 7.1",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Screen", ScreenSchema);
