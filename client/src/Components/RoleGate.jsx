import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import React from 'react'
const PUBLIC_PATHS = ["/", "/register", "/login"];

export default function RoleGate({ children }) {
  const location = useLocation();

  const [role, setRole] = useState("loading");
  const [hydrated, setHydrated] = useState(false);

  // ⏳ Allow cookies to hydrate
  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    async function detectRole() {
      try {
        // 1️⃣ ADMIN / USER
        const authRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const authData = await authRes.json();

        if (authData.ok) {
          setRole(authData.user.role); // admin | user
          return;
        }

        // 2️⃣ SELLER
        const sellerRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const sellerData = await sellerRes.json();

        if (sellerData.ok) {
          setRole("seller");
          return;
        }

        // 3️⃣ GUEST
        setRole("guest");
      } catch {
        setRole("guest");
      }
    }

    detectRole();
  }, [hydrated]);

  if (!hydrated || role === "loading") return null;

  const path = location.pathname;

  /* ───────── ADMIN RULES ───────── */

  // Non-admin accessing admin pages
  if (path.startsWith("/admin") && role !== "admin") {
    return <Navigate to="/register" replace />;
  }

  // Admin landing redirect (AFTER hydration)
  if (
    role === "admin" &&
    !path.startsWith("/admin") &&
    !PUBLIC_PATHS.includes(path)
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  /* ───────── USER RULES ───────── */

  if (
    role === "user" &&
    (path.startsWith("/admin") || path.startsWith("/seller"))
  ) {
    return <Navigate to="/" replace />;
  }

  /* ───────── SELLER RULES ───────── */
  // Seller routes protected elsewhere

  return children;
}
