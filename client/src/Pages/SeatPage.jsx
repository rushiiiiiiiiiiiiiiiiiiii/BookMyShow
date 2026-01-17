// client/src/Pages/SeatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { toast } from "react-hot-toast";

// --- Colors ---
const BMS_GREEN = "#1FA85D";
const BMS_BTN = "bg-[#f84464] hover:bg-[#e43a57]";

const SEAT_PRICE = 250;
const AISLE_AFTER_SEAT = 6;

// ------------------------------------------------
// LEGEND
// ------------------------------------------------
function Legend({ color, border, label, style }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <div
        className={`w-4 h-4 rounded-sm ${color} ${
          border ? "border border-gray-400" : ""
        }`}
        style={style}
      />
      {label}
    </div>
  );
}

// ------------------------------------------------
// SEAT
// ------------------------------------------------
function Seat({ id, booked, selected, toggleSeat, loading }) {
  const isBooked = booked.includes(id);
  const isSelected = selected.includes(id);

  let base =
    "w-7 h-6 mx-1 mb-1 rounded-t-md transition-all duration-150 flex items-center justify-center text-[9px] font-semibold select-none";

  if (isBooked) {
    base += " bg-gray-500 cursor-not-allowed text-white";
  } else if (isSelected) {
    base += " shadow-md scale-105 text-white";
  } else {
    base +=
      " bg-white border border-gray-400 cursor-pointer hover:bg-gray-200 text-gray-800";
  }

  return (
    <div
      title={id}
      className={base}
      style={isSelected ? { backgroundColor: BMS_GREEN } : {}}
      onClick={() => toggleSeat(id)}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-[2.5px] border-[#f84464]/30 border-t-[#f84464] rounded-full animate-spin"></div>
      ) : (
        id.slice(1)
      )}
    </div>
  );
}

// ------------------------------------------------
// MAIN PAGE
// ------------------------------------------------
export default function SeatPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
  const [screen, setScreen] = useState(null);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockingSeats, setLockingSeats] = useState([]);

  // -------------------------
  // LOAD DATA
  // -------------------------
  async function loadSeatData() {
    try {
      const showRes = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/shows/${id}`,
      );
      if (showRes.data.ok) setShow(showRes.data.show);

      const seatRes = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/user/seats/${id}`,
      );

      if (seatRes.data.ok) {
        const bookedArr = (seatRes.data.booked || []).map((s) => s.seatNumber);
        const lockedArr = (seatRes.data.locked || []).map((s) => s.seatNumber);
        setBooked([...new Set([...bookedArr, ...lockedArr])]);
        setScreen(seatRes.data.screen);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadSeatData();
  }, [id]);

  // -------------------------
  // TOGGLE SEAT
  // -------------------------
  async function toggleSeat(seat) {
    if (booked.includes(seat)) return;
    if (lockingSeats.includes(seat)) return;

    const max = show?.maxSeatsPerBooking || 1;
    const alreadySelected = selected.includes(seat);

    if (!alreadySelected && selected.length >= max) {
      toast.error(`You can only book ${max} ticket(s).`);
      return;
    }

    const newSelected = alreadySelected
      ? selected.filter((s) => s !== seat)
      : [...selected, seat];

    if (newSelected.length === 0) {
      setSelected([]);
      return;
    }

    try {
      setLockingSeats((p) => [...p, seat]);
      const res = await axios.post(
        "https://bookmyshow-backend-mzd2.onrender.com/api/lock-seats",
        { showId: id, seats: newSelected },
        { withCredentials: true },
      );

      if (!res.data.ok) {
        toast.error("Seat locked by someone else");
        loadSeatData();
        return;
      }

      setSelected(newSelected);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login");
        navigate("/register");
      }
    } finally {
      setLockingSeats((p) => p.filter((s) => s !== seat));
    }
  }

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-14 h-14 border-[4px] border-[#f84464]/20 border-t-[#f84464] rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!screen || !show) {
    return <div className="p-10 text-center">Failed to load seats</div>;
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rows = alphabet.slice(0, screen.rows);
  const seatsPerRow = screen.seatsPerRow;
  const leftSeats = AISLE_AFTER_SEAT;
  const rightSeats = seatsPerRow - AISLE_AFTER_SEAT;
  const total = selected.length * SEAT_PRICE;
  const limit = show.maxSeatsPerBooking || 1;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-28">
      {/* HEADER */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center">
          <img
            src={show.poster}
            alt={show.movie}
            className="w-14 h-20 object-cover rounded-md hidden sm:block"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold truncate">{show.movie}</h1>
            <p className="text-xs text-gray-600">
              {show.language} · {show.format}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {show.theatreId?.name} · {show.screenId?.name}
            </p>
            <p className="text-xs font-medium">
              {new Date(show.date).toDateString()} · {show.time}
            </p>
          </div>
          <div className="text-xs font-semibold text-red-600">MAX {limit}</div>
        </div>
      </div>

      {/* SCREEN */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-6">
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-xs">
            <div className="h-3 bg-black rounded-t-full opacity-70" />
            <div className="h-3 w-[80%] mx-auto bg-black rounded-t-full absolute -top-1 left-1/2 -translate-x-1/2 opacity-90" />
            <p className="text-center mt-3 text-xs tracking-widest text-gray-600">
              SCREEN THIS WAY
            </p>
          </div>
        </div>

        {/* SEATS */}
        <div className="flex flex-col items-start overflow-x-auto pb-6 px-2">
          {rows.split("").map((r) => (
            <div key={r} className="flex items-center mb-2 min-w-max pl-1">
              <span className="w-6 text-right mr-3 text-xs text-gray-500">
                {r}
              </span>

              <div className="flex">
                {[...Array(leftSeats)].map((_, i) => (
                  <Seat
                    key={`${r}${i + 1}`}
                    id={`${r}${i + 1}`}
                    booked={booked}
                    selected={selected}
                    toggleSeat={toggleSeat}
                    loading={lockingSeats.includes(`${r}${i + 1}`)}
                  />
                ))}

                <div className="w-8" />

                {[...Array(rightSeats)].map((_, i) => (
                  <Seat
                    key={`${r}${leftSeats + i + 1}`}
                    id={`${r}${leftSeats + i + 1}`}
                    booked={booked}
                    selected={selected}
                    toggleSeat={toggleSeat}
                    loading={lockingSeats.includes(`${r}${leftSeats + i + 1}`)}
                  />
                ))}
              </div>

              <span className="w-6 ml-3 text-xs text-gray-500">{r}</span>
            </div>
          ))}
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap justify-center gap-6 border-t pt-5">
          <Legend color="bg-gray-400" label="Sold / Locked" />
          <Legend color="bg-white" border label="Available" />
          <Legend label="Selected" style={{ backgroundColor: BMS_GREEN }} />
        </div>
      </div>

      {/* PAY BAR */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 flex justify-between items-center z-50">
          <div>
            <div className="font-bold">
              {selected.length} / {limit} Ticket(s)
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {selected.join(", ")}
            </div>
          </div>

          <button
            className={`${BMS_BTN} text-white px-6 py-2 rounded-lg font-bold`}
            onClick={() =>
              navigate("/pay", {
                state: { show, seats: selected, amount: total },
              })
            }
          >
            Pay ₹ {total.toLocaleString("en-IN")}
          </button>
        </div>
      )}
    </div>
  );
}
