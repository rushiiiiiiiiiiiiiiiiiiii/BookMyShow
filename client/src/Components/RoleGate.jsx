import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import React from "react";
export default function RoleGate({ children }) {
  const location = useLocation();
  const [role, setRole] = useState("loading");

  useEffect(() => {
    async function detectRole() {
      try {
        // 1️⃣ Check SELLER first
        const sellerRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const sellerData = await sellerRes.json();

        if (sellerData.ok) {
          setRole("seller");
          return;
        }

        // 2️⃣ Check USER / ADMIN
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await res.json();

        if (data.ok) {
          setRole(data.user.role); // user | admin
        } else {
          setRole("guest");
        }
      } catch {
        setRole("guest");
      }
    }

    detectRole();
  }, []);

  if (role === "loading") return null;

  const path = location.pathname;

  // 🚫 GUEST → block admin & seller EXCEPT seller auth pages
  // 🚫 GUEST → block admin & seller EXCEPT seller auth pages
  if (
    role === "guest" &&
    (path.startsWith("/admin") ||
      (path.startsWith("/seller") &&
        !path.startsWith("/seller/signin") &&
        !path.startsWith("/seller/onboard")))
  ) {
    return <Navigate to="/register" replace />;
  }

  // 🚫 SELLER → only /seller/*
  if (role === "seller" && !path.startsWith("/seller")) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  // 🚫 USER → cannot access admin/seller
  if (
    role === "user" &&
    (path.startsWith("/admin") || path.startsWith("/seller"))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
