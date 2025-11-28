import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });

        const data = await res.json();
        if (data.ok) setIsAuth(true);
        else setIsAuth(false);
      } catch {
        setIsAuth(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuth === null) return null; // loader later

  return isAuth ? children : <Navigate to="/register" />;
}
