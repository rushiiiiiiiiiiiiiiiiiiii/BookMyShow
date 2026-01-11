import React, { useRef, useEffect } from "react";
import { X, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchModal({
  open,
  onClose,
  search,
  setSearch,
  movies = [],
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const results = search
    ? movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex justify-center items-start pt-16">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl">
        {/* SEARCH BAR */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Movies, Events, Plays, Sports and more"
            className="w-full text-[19px] font-medium text-gray-800 outline-none placeholder:text-gray-400"
          />
          <X
  size={22}
  className="cursor-pointer text-gray-400 hover:text-black"
  onClick={onClose}
/>
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex gap-4 px-6 py-4 overflow-x-auto">
          {["Movies", "Stream", "Events", "Plays", "Sports", "Activities"].map(
            (c) => (
              <span
                key={c}
                className="px-5 py-1.5 rounded-full text-sm font-medium text-[#f84464] border border-[#f84464]/40 hover:bg-[#f84464]/5 cursor-pointer"
              >
                {c}
              </span>
            )
          )}
        </div>

        {/* RESULTS */}
        <div className="max-h-[400px] overflow-y-auto">
          {results.map((m) => (
            <div
              key={m.title}
              onClick={() => {
                navigate(`/movie/${encodeURIComponent(m.title)}`);
                onClose();
                setSearch("");
              }}
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 flex items-center justify-center rounded bg-gray-100">
                  🎬
                </div>
                <span className="text-gray-900 font-medium">{m.title}</span>
              </div>

              <span className="text-gray-400 text-sm">›</span>

            </div>
          ))}

          {search && results.length === 0 && (
            <p className="px-5 py-6 text-gray-500">
              No results found for "<b>{search}</b>"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
