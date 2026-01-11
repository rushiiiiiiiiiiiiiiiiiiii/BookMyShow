import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  Monitor,
  Calendar,
  Ticket,
  IndianRupee,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // helper for active link
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-gray-300 hidden md:flex flex-col">
      {/* LOGO */}
      <div className="px-6 py-3 border-b border-gray-300">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Bookmyshow-logoid.png"
          alt="BookMyShow"
          className="w-32"
        />
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 text-sm text-gray-700">
        <ul className="space-y-3">
          <li
            onClick={() => navigate("/admin/dashboard")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/admin/dashboard")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Home size={18} />
            Dashboard
          </li>

          <li
            onClick={() => navigate("/admin/sellers")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/admin/sellers")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Users size={18} />
            Sellers
          </li>

          <li
            onClick={() => navigate("/admin/theatres")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/admin/theatres")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Building2 size={18} />
            Theatres
          </li>

          <li
            onClick={() => navigate("/admin/screens")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/admin/screens")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Monitor size={18} />
            Screens
          </li>

          <li
            onClick={() => navigate("/admin/shows")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/admin/shows")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Calendar size={18} />
            Shows
          </li>

          <li
            onClick={() => navigate("/admin/bookings")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/admin/bookings")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Ticket size={18} />
            Bookings
          </li>
        </ul>
      </nav>

      {/* CTA */}
      <div className="p-4 border-t">
        <button
          onClick={() => navigate("/admin/sellers/pending")}
          className="w-full bg-[#f84464] hover:bg-[#e43a57] text-white py-2 rounded-lg"
        >
          Review Sellers
        </button>
      </div>
    </aside>
  );
}
