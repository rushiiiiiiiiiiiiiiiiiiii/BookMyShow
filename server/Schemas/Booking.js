const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  showId: mongoose.Schema.Types.ObjectId,
  movie: String,
  seats: [String],
  amount: Number,
  theatre: Object,
  screen: Object,
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
