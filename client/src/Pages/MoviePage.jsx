import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Clock, Globe, BadgeCheck } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const BMS_BTN = "bg-[#f84464] hover:bg-[#e43a57] active:bg-[#d6334f]";

export default function MoviePage() {
  const { name } = useParams();
  const movieName = decodeURIComponent(name);
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        // ✅ CORRECT API ROUTE
        const res = await axios.get(
          `http://localhost:8000/api/shows/movie?movie=${encodeURIComponent(
            movieName
          )}`
        );

        if (res.data.ok && res.data.shows.length > 0) {
          setShows(res.data.shows);
          setMovie(res.data.shows[0]);
        } else {
          setMovie(null);
        }
      } catch (err) {
        console.error("MOVIE PAGE ERROR:", err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [movieName]);

  // ✅ LOADING
  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-600">
        Loading movie...
      </div>
    );
  }

  // ✅ NOT FOUND
  if (!movie) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Movie Not Found</h2>
        <p className="text-gray-500 mt-2">
          No shows available for "{movieName}"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      {/* HERO */}
      <div
        className="h-[420px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-8">
          <div className="flex gap-8">
            {/* POSTER */}
            <img
              src={movie.poster}
              className="h-72 rounded-lg shadow-xl"
              alt={movie.movie}
            />

            {/* DETAILS */}
            <div className="text-white">
              <h1 className="text-4xl font-bold">{movie.movie}</h1>

              <div className="mt-3 flex gap-4 items-center text-sm">
                <span className="flex gap-1 items-center">
                  <Clock size={14} /> {movie.durationMinutes} mins
                </span>

                <span className="flex gap-1 items-center">
                  <Globe size={14} /> {movie.language}
                </span>

                <span className="flex gap-1 items-center">
                  <BadgeCheck size={14} /> {movie.certificate}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-300">
                Format: {movie.format} | Subtitles:{" "}
                {movie.isSubtitled ? "Yes" : "No"}
              </div>

              <button
                className={`mt-6 px-6 py-3 rounded-lg text-white ${BMS_BTN}`}
                onClick={() => navigate(`/buytickets/${movie.movie}`)}
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold mb-2">About the movie</h2>
          <p className="text-gray-700">
            Stranger Things Season 5 continues the thrilling saga of Hawkins
            with dark mysteries, supernatural forces, and intense battles
            between good and evil.
          </p>
        </div>
      </div>

      {/* THEATRES */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <h2 className="text-xl font-bold mb-4">
          Theatres in {movie.theatreId?.city}
        </h2>

        <div className="space-y-4">
          {shows.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{s.theatreId.name}</h3>
                <p className="text-sm text-gray-500">
                  Screen: {s.screenId.name} · {s.format}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <div
                  onClick={() => navigate(`/seats/${s._id}`)}
                  className="border px-4 py-2 rounded text-green-600 font-semibold cursor-pointer hover:bg-green-50"
                >
                  {s.time}
                </div>

                <div className="text-sm text-gray-700">₹{s.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING */}
      <div className="max-w-7xl mx-auto px-6 mb-10 mt-12">
        <h2 className="text-xl font-bold mb-4">Upcoming Movies</h2>

        <div className="flex gap-6 overflow-x-auto">
          {[
            {
              title: "Dunki",
              img: "https://m.media-amazon.com/images/I/91zOCNs+x-L.jpg",
            },
            {
              title: "Pushpa 2",
              img: "https://m.media-amazon.com/images/M/MV5BZjllNTdiM2QtYjQ0Ni00ZGM1LWFlYmUtNWY0YjMzYWIxOTYxXkEyXkFqcGc@._V1_.jpg",
            },
            {
              title: "KGF Chapter 3",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5XXL0RadcwWnn6JfiAlGK5lvHiZ1lMhogA&s",
            },
            {
              title: "Animal Park",
              img: "https://preview.redd.it/talking-about-animal-park-v0-bngithurymyd1.jpeg?width=1080&crop=smart&auto=webp&s=c449d59919c1a8972290fd9d6e92208e528d686d",
            },
            {
              title: "Salaar 2",
              img: "https://m.media-amazon.com/images/M/MV5BOGE3YWQ3NzAtNmEwOS00OGY5LThkNzEtZDg5NDRjMzRmMzhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            },
            {
              title: "Tiger 3",
              img: "https://upload.wikimedia.org/wikipedia/en/f/f8/Tiger_3_poster.jpg",
            },
            {
              title: "Fighter",
              img: "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg",
            },
            {
              title: "Jawan 2",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5xzqrrx8pVxJ5eJd_PbVV1WVxRcPRHrRNNA&s",
            },
          ].map((m, i) => (
            <div key={i} className="w-40">
              <img
                src={m.img}
                className="h-56 rounded-lg shadow object-cover"
                alt={m.title}
              />
              <div className="mt-2 font-bold text-center">{m.title}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
