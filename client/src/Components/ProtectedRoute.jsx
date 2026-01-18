import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import React from 'react'
export default function ProtectedRoute({ children }) {
  const [state, setState] = useState({
    loading: true,
    ok: false,
    role: null,
  });

  useEffect(() => {
    fetch("https://bookmyshow-backend-mzd2.onrender.com/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setState({
          loading: false,
          ok: data.ok,
          role: data.user?.role,
        });
      })
      .catch(() => {
        setState({ loading: false, ok: false, role: null });
      });
  }, []);

  if (state.loading) return null;

  if (!state.ok) {
    return <Navigate to="/register" replace />;
  }

  // ❌ seller/admin blocked from user routes
  if (state.role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
}
