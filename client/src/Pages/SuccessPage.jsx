import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, CheckCircle, Calendar, MapPin, Ticket } from "lucide-react";
import QRCode from "react-qr-code";

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    // Set a subtle background color for the page
    document.body.style.background = "#eef4f9"; // Lighter, modern background

    // Delay the ticket appearance for the success animation
    const timer = setTimeout(() => {
      setShowTicket(true);
    }, 1500); // Reduced delay for quicker transition

    return () => {
      clearTimeout(timer);
      document.body.style.background = ""; // Clean up
    };
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        No booking found
      </div>
    );
  }

  const bookingId = booking._id;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      {/* 🚀 SUCCESS SCREEN - More impactful animation */}
      {!showTicket && (
        <div className="flex flex-col items-center">

          {/* Checkmark with a pop-in effect */}
          <div className="bg-green-500 p-6 rounded-full shadow-2xl animate-pop">
            <CheckCircle size={56} className="text-white" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-gray-800 animate-slide-in-up">
            Booking Confirmed!
          </h1>

          <p className="mt-2 text-md text-gray-500 animate-slide-in-up delay-200">
            Enjoy your movie experience.
          </p>
        </div>
      )}

      {/* 🎫 TICKET CARD - Premium look */}
      {showTicket && (
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-ticket-slide">
          
          {/* TICKET HEADER - Movie Info */}
          <div className="relative">
            <img 
              src={booking.poster} 
              className="h-48 w-full object-cover rounded-t-3xl" // Slightly taller image
              alt={`${booking.movie} poster`}
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white text-xl font-bold">{booking.movie}</h2>
              <div className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                <Ticket size={14} />
                <span className="font-semibold">{booking.seats.length} Tickets</span>
              </div>
            </div>
          </div>

          {/* TICKET BODY - Details */}
          <div className="p-5 space-y-4">

            {/* Theatre & Screen */}
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <MapPin size={16} className="text-red-500" />
              <div>
                <strong className="block">{booking.theatre}</strong>
                <span className="text-xs text-gray-500">{booking.screen}</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between border-t pt-4">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span className="text-xs font-semibold">DATE</span>
                </div>
                <strong className="text-lg text-gray-800">{booking.date}</strong>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-500">TIME</span>
                <strong className="text-lg text-gray-800">{booking.time}</strong>
              </div>
            </div>
            
            {/* Seats & Amount */}
            <div className="bg-blue-50/50 rounded-xl p-3 text-sm flex justify-between items-center mt-4">
              <span className="font-semibold text-gray-700">Seats:</span>
              <strong className="text-blue-600 tracking-wider">
                {booking.seats.join(", ")}
              </strong>
            </div>

            <div className="flex justify-between font-bold text-xl pt-2">
              <span className="text-gray-600">Total Paid</span>
              <span className="text-green-600">₹ {booking.amount}</span>
            </div>
          </div>
          
          {/* Perforated Divider (More stylish) */}
          <div className="relative h-4 overflow-hidden">
            <div className="border-t border-dashed border-gray-300 mx-5" />
            {/* Add tear-off effect elements */}
            <div className="absolute top-0 left-[-8px] w-4 h-4 rounded-full bg-[#eef4f9] translate-y-[-50%]" />
            <div className="absolute top-0 right-[-8px] w-4 h-4 rounded-full bg-[#eef4f9] translate-y-[-50%]" />
          </div>

          {/* TICKET FOOTER - QR Code & ID */}
          <div className="grid grid-cols-3 gap-4 p-5 items-center">
            
            {/* QR Code */}
            <div className="col-span-1 flex justify-center">
              <div className="p-1 rounded-lg border border-gray-100 shadow-inner bg-white">
                <QRCode value={bookingId} size={70} />
              </div>
            </div>

            {/* Booking Details */}
            <div className="col-span-2 text-sm space-y-1">
              <p className="font-semibold text-gray-600">Booking ID</p>
              <p className="font-mono text-xs break-all text-gray-900 bg-gray-50 p-1 rounded">
                {bookingId}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle size={14} className="text-green-600" />
                <p className="text-green-600 font-bold text-sm">BOOKING VALID</p>
              </div>
            </div>
          </div>

          {/* Home Button */}
          <div className="p-5 pt-0">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#f84464] hover:bg-[#e43a57] text-white py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center">
              <Home size={18} className="inline mr-2" />
              GO TO HOME
            </button>
          </div>

        </div>
      )}

      {/* 🚀 IMPROVED ANIMATIONS */}
      <style>
        {`
          /* Success Screen Animations */
          .animate-pop {
            animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.27);
          }
          .animate-slide-in-up {
            animation: slideInUp 0.6s ease-out forwards;
            opacity: 0;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }

          /* Ticket Card Animation */
          .animate-ticket-slide {
            animation: ticketSlide 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth transition */
          }

          /* Keyframes */
          @keyframes pop {
            0% { transform: scale(0.5) rotate(-45deg); opacity: 0; }
            80% { transform: scale(1.05) rotate(0deg); opacity: 1; }
            100% { transform: scale(1); }
          }

          @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0 }
            to { transform: translateY(0); opacity: 1 }
          }

          @keyframes ticketSlide {
            from { transform: scale(0.9) translateY(40px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}
      </style>

    </div>
  );
}