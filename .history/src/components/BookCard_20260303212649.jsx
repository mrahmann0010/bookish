import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaCheck } from "react-icons/fa";

// Spine accent colors rotating amber → rust → sage
const SPINE_COLORS = ["#C9813A", "#9B3D2B", "#4A6741"];

/**
 * BookCard — Portrait card with editorial book-spine strip
 * Optional props: isInList (bool), onAdd (fn) — for hover quick-add
 */
export default function BookCard({ book, index = 0, isInList = false, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const spineColor = SPINE_COLORS[index % SPINE_COLORS.length];

  const imgEnd = "https://covers.openlibrary.org/b/id/";
  const coverUrl = book.cover_i
    ? `${imgEnd}${book.cover_i}-L.jpg`
    : null;

  // Fallback — colored spine pattern with title initials
  const initials = book.title
    ? book.title
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className="relative group transition-all duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "6px 12px 28px rgba(28,22,18,0.18)"
          : "4px 6px 20px rgba(28,22,18,0.08)",
        borderRadius: "6px",
      }}
    >
      {/* Already-in-list badge */}
      {isInList && (
        <span
          className="absolute top-2 right-2 z-20 flex items-center justify-center w-6 h-6 rounded-full text-white text-xs"
          style={{ background: "#4A6741" }}
          title="In your list"
        >
          <FaCheck size={10} />
        </span>
      )}

      <Link to={`/${book.id}`} className="block">
        {/* Left spine strip */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 rounded-tl-[6px] rounded-bl-[6px]"
          style={{ width: "8px", background: spineColor }}
        />

        {/* Cover image */}
        <div
          className="overflow-hidden rounded-t-[6px]"
          style={{ aspectRatio: "2/3", background: "#EDE6D6" }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          ) : (
            // Fallback: spine-style colored block with initials
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${spineColor}22` }}
            >
              <span
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: spineColor,
                  opacity: 0.7,
                }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Hover quick-add overlay */}
          {onAdd && hovered && (
            <div
              className="absolute inset-0 flex items-end justify-center pb-4 transition-opacity duration-200"
              style={{ background: "rgba(28,22,18,0.55)" }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAdd(book);
                }}
                className="px-4 py-1.5 text-xs font-medium tracking-wide transition-colors"
                style={{
                  background: "transparent",
                  border: "1px solid #C9813A",
                  color: "#C9813A",
                  borderRadius: "3px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {isInList ? "Added" : "+ Add to List"}
              </button>
            </div>
          )}
        </div>

        {/* Bottom info panel */}
        <div
          className="p-3 rounded-b-[6px]"
          style={{ background: "#EDE6D6" }}
        >
          <h4
            className="line-clamp-2 leading-snug mb-1.5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#1C1612",
            }}
          >
            {book.title}
          </h4>
          <p
            className="truncate mb-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              color: "#8C7B6B",
            }}
          >
            {book.author_name?.slice(0, 2).join(", ") || "Unknown author"}
          </p>
          <div
            className="flex items-center justify-between"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              color: "#8C7B6B",
            }}
          >
            <span>{book.first_published ? `${book.first_published}` : "—"}</span>
            {book.ratings_average ? (
              <span className="flex items-center gap-1">
                <FaStar size={9} style={{ color: "#C9813A" }} />
                {book.ratings_average.toFixed(1)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}
