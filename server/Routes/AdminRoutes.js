const express = require("express");
const router = express.Router();
const admin = require("../Controllers/AdminController");
// const adminAuth = require("../Middlewears/adminAuth");

// DASHBOARD
// router.get("/dashboard", adminAuth, admin.getDashboardStats);
router.get("/dashboard", admin.getDashboardStats);

// SELLERS
// router.get("/sellers", adminAuth, admin.getAllSellers);
router.get("/sellers", admin.getAllSellers);

// router.get("/sellers/pending", adminAuth, admin.getPendingSellers);
router.get("/sellers/pending", admin.getPendingSellers);

// router.put("/seller/:id/status", adminAuth, admin.updateSellerStatus);
router.put("/seller/:id/status", admin.updateSellerStatus);

// THEATRES / SCREENS / SHOWS
// router.get("/theatres", adminAuth, admin.getAllTheatres);
router.get("/theatres", admin.getAllTheatres);

// router.get("/screens", adminAuth, admin.getAllScreens);
router.get("/screens", admin.getAllScreens);

// router.get("/shows", adminAuth, admin.getAllShows);
router.get("/shows", admin.getAllShows);

// BOOKINGS / REVENUE
// router.get("/bookings", adminAuth, admin.getAllBookings);
router.get("/bookings", admin.getAllBookings);

// router.get("/revenue", adminAuth, admin.getRevenue);
router.get("/revenue", admin.getRevenue);

// routes/AdminRoutes.js
router.put("/theatre/:id/status", admin.updateTheatreStatus);

module.exports = router;
