import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function BookCard({ book }) {
  const imgEnd = "https://covers.openlibrary.org/b/id/";
  const imgSize = "-L.jpg"; // larger image
  const coverUrl = book.cover_i
    ? `${imgEnd}${book.cover_i}${imgSize}`
    : "/placeholder.png";

  return (
    <Link to={`/${book.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition transform group-hover:-translate-y-2 bg-gradient-to-br from-[#e0e7ef] via-[#f8fafc] to-[#cbd5e1] border border-[#e0e7ef]">
        <div className="flex flex-col items-center p-4">
          <img
            src={coverUrl}
            alt={book.title}
            loading="lazy"
            className="w-32 h-48 object-cover rounded-xl border border-[#cbd5e1] mb-4 bg-white"
          />
          <h4 className="text-lg font-bold text-[#232946] mb-1 truncate text-center">
            {book.title}
          </h4>
          <p className="text-sm text-[#6b7280] mb-2 text-center">
            {book.author_name?.join(", ") || "Unknown"}
          </p>
          <div className="flex items-center gap-2">
            <FaStar className="text-[#fbbf24] text-lg" />
            <span className="text-sm text-[#232946] font-semibold">
              {book.ratings_average ? book.ratings_average.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 bg-[#6a82fb] text-white text-xs px-3 py-1 rounded-bl-xl font-semibold shadow-sm">
          {book.first_published ? `First: ${book.first_published}` : "New"}
        </div>
      </div>
    </Link>
  );
}
