import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Register from "./AuthUser/Register";
import SetupName from "./AuthUser/SetupName";
import Home from "./Pages/Home";

import PublicRoute from "./Components/PublicRoute";
import ProtectedRoute from "./Components/ProtectedRoute";
import SellerProtectedRoute from "./Components/SellerProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import AdminBlocker from "./Components/AdminBlocker";

// USER
import UserShows from "./Pages/UserShows";
import MoviePage from "./Pages/MoviePage";
import SeatPage from "./Pages/SeatPage";
import PaymentPage from "./Pages/PaymentPage";
import SuccessPage from "./Pages/SuccessPage";
import BuyTicketsPage from "./Pages/BuyTicketsPage";
import MyBookingsPage from "./Pages/MyBookingsPage";
import MovieReviewsPage from "./Pages/MovieReviewsPage";

// SELLER
import SellerLogin from "./AuthSeller/SellerLogin";
import SellerOnboard from "./AuthSeller/SellerOnboard";
import SellerDashboard from "./AuthSeller/SellerDashboard";
import TheaterList from "./AuthSeller/TheaterList";
import ScreenList from "./AuthSeller/ScreenList";
import ShowsList from "./AuthSeller/ShowsList";
import SellerBookings from "./AuthSeller/SellerBookings";
import AddTheatre from "./AuthSeller/Add-theatre";
import AddScreen from "./AuthSeller/Add-Screen";
import AddShow from "./AuthSeller/Add-Show";

// ADMIN
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import AdminSellers from "./SuperAdmin/AdminSellers";
import AdminTheatres from "./SuperAdmin/AdminTheatres";
import AdminScreens from "./SuperAdmin/AdminScreens";
import AdminShows from "./SuperAdmin/AdminShows";
import AdminBookings from "./SuperAdmin/AdminBookings";
import SellerBlocker from "./Components/SellerBlocker";

export default function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <BrowserRouter>
      <AdminBlocker>
      <SellerBlocker>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* USER */}
          <Route
            path="/setup-name"
            element={
              <ProtectedRoute>
                <SetupName />
              </ProtectedRoute>
            }
          />
          <Route path="/shows" element={<UserShows />} />
          <Route path="/movie/:name" element={<MoviePage />} />
          <Route path="/movie/:name/reviews" element={<MovieReviewsPage />} />
          <Route path="/seats/:id" element={<SeatPage />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/buytickets/:movieName" element={<BuyTicketsPage />} />
          <Route path="/profile" element={<MyBookingsPage />} />

          {/* SELLER */}
          <Route path="/seller/signin" element={<SellerLogin />} />
          <Route path="/seller/onboard" element={<SellerOnboard />} />

          <Route
            path="/seller/dashboard"
            element={
              <SellerProtectedRoute>
                <SellerDashboard />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/bookings"
            element={
              <SellerProtectedRoute>
                <SellerBookings />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/theatres"
            element={
              <SellerProtectedRoute>
                <TheaterList />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/screens"
            element={
              <SellerProtectedRoute>
                <ScreenList />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/shows"
            element={
              <SellerProtectedRoute>
                <ShowsList />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/add-theatre"
            element={
              <SellerProtectedRoute>
                <AddTheatre />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/add-screen/:theatreId"
            element={
              <SellerProtectedRoute>
                <AddScreen />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/add-show/:theatreId"
            element={
              <SellerProtectedRoute>
                <AddShow />
              </SellerProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <SuperAdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <AdminRoute>
                <AdminSellers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/theatres"
            element={
              <AdminRoute>
                <AdminTheatres />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/screens"
            element={
              <AdminRoute>
                <AdminScreens />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/shows"
            element={
              <AdminRoute>
                <AdminShows />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
        </Routes>
        </SellerBlocker>
        </AdminBlocker>
      </BrowserRouter>
    </>
  );
}
