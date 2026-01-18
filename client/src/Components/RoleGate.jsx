import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

const PUBLIC_PATHS = ["/", "/register", "/login"];

export default function RoleGate({ children }) {
  const location = useLocation();
  const [role, setRole] = useState("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
          setReady(true);
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
          setReady(true);
          return;
        }

        // 3️⃣ GUEST
        setRole("guest");
        setReady(true);
      } catch {
        setRole("guest");
        setReady(true);
      }
    }

    detectRole();
  }, []);

  if (!ready) return null;

  const path = location.pathname;

  /* ───────── ADMIN RULES ───────── */

  // Block non-admin from admin pages
  if (path.startsWith("/admin") && role !== "admin") {
    return <Navigate to="/register" replace />;
  }

  // ❗ DO NOT force admin redirect from public pages
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
  // Seller handled by SellerProtectedRoute ONLY

  return children;
}
