import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

export default function UserShows() {
  const city = localStorage.getItem("city") || "Mumbai";
  const [shows, setShows] = useState([]);

  useEffect(() => {
    loadShows();
  }, [city]);

  async function loadShows() {
    const res = await axios.get(`https://bookmyshow-backend-mzd2.onrender.com/api/shows-city?city=${city}`);
    if (res.data.ok) setShows(res.data.shows);
  }

  // Group by movie + theatre
  const grouped = {};

  shows.forEach((show) => {
    const key = `${show.movie}-${show.theatreId.name}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(show);
  });

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Movies in {city}</h2>

        {Object.entries(grouped).map(([key, list]) => (
          <div key={key} className="bg-white rounded-lg shadow mb-4 p-4">
            <h4 className="font-bold">{list[0].movie}</h4>
            <p className="text-sm text-gray-500">{list[0].theatreId.name}</p>

            <div className="flex gap-2 mt-2">
              {list.map((s) => (
                <a
                  key={s._id}
                  href={`/seat/${s._id}`}
                  className="border px-3 py-1 rounded text-sm hover:bg-[#f84464] hover:text-white"
                >
                  {s.time}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
