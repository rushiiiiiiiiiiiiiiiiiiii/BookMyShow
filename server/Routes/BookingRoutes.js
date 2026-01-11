// server/Routes/BookingRoutes.js
const router = require("express").Router();
const authMiddleware = require("../Middlewears/auth");
const {
  createBooking,
  getMyBookings,
  getBooking,
  lockSeats,
} = require("../Controllers/BookingController");

router.post("/lock-seats", authMiddleware, lockSeats);

router.post("/booking", authMiddleware, createBooking);

router.get("/my-bookings", authMiddleware, getMyBookings);

router.get("/booking/:id", authMiddleware, getBooking);

module.exports = router;
