import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import React from 'react'
export default function SellerProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    fetch("https://bookmyshow-backend-mzd2.onrender.com/api/seller/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setState({ loading: false, ok: data.ok }))
      .catch(() => setState({ loading: false, ok: false }));
  }, []);

  if (state.loading) return null;
  if (!state.ok) return <Navigate to="/seller/signin" replace />;

  return children;
}
