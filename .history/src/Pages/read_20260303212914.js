import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FiCheckSquare, FiSquare } from "react-icons/fi";
import BookCard from "../components/BookCard";

// Open-book watermark SVG for header
const BookWatermark = () => (
  <svg
    className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none"
    width="220"
    height="160"
    viewBox="0 0 80 60"
    fill="white"
    aria-hidden="true"
  >
    <path d="M2 5h26a4 4 0 0 1 4 4v42a3 3 0 0 0-3-3H2z" />
    <path d="M78 5H52a4 4 0 0 0-4 4v42a3 3 0 0 1 3-3h27z" />
    <rect x="38" y="3" width="4" height="52" rx="2" />
  </svg>
);

const FILTER_TABS = ["All", "Want to Read", "Reading", "Finished"];

export default function Read({ readLater, setReadLater }) {
  const [filter, setFilter]       = useState("All");
  const [selected, setSelected]   = useState(new Set());
  const [viewMode, setViewMode]    = useState("grid");

  const toggleSelect = (key) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const selectAll = () =>
    setSelected(new Set(readLater.map((b) => b.key)));

  const clearSelection = () => setSelected(new Set());

  const removeSelected = () => {
    setReadLater((prev) => prev.filter((b) => !selected.has(b.key)));
    setSelected(new Set());
  };

  const removeOne = (key) =>
    setReadLater((prev) => prev.filter((b) => b.key !== key));

  // All books shown under every tab (filter tabs are UI-only in this version)
  const displayed = readLater;

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh", paddingTop: "64px" }}>
      {/* ── Ink banner header ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "#1C1612", padding: "48px 24px 40px" }}
      >
        <BookWatermark />
        <div className="max-w-container mx-auto relative z-10">
          <p
            className="mb-3 text-xs tracking-[0.25em] uppercase"
            style={{ fontFamily: "'DM Mono', monospace", color: "#C9813A" }}
          >
            Your collection
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 48px)",
              color: "#F5F0E8",
              lineHeight: 1.15,
            }}
          >
            My Bookshelf
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px",
              color: "rgba(245,240,232,0.4)",
            }}
          >
            {readLater.length} {readLater.length === 1 ? "title" : "titles"} saved
          </p>
        </div>
      </div>

      {/* ── Filter / sort bar ── */}
      <div
        className="sticky top-[64px] z-40"
        style={{
          background: "#EDE6D6",
          borderBottom: "1px solid #D9CEBB",
        }}
      >
        <div className="max-w-container mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          {/* Tab pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="px-4 py-1.5 text-xs rounded-full transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  background: filter === tab ? "#C9813A" : "transparent",
                  color: filter === tab ? "#1C1612" : "#8C7B6B",
                  border: `1px solid ${filter === tab ? "#C9813A" : "#D9CEBB"}`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            {["grid", "list"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1 text-xs rounded transition-all"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  background: viewMode === mode ? "#C9813A" : "transparent",
                  color: viewMode === mode ? "#1C1612" : "#8C7B6B",
                  border: `1px solid ${viewMode === mode ? "#C9813A" : "#D9CEBB"}`,
                }}
              >
                {mode === "grid" ? "⊞" : "≡"} {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 py-10">
        {/* Empty state */}
        {displayed.length === 0 && (
          <div className="text-center py-24">
            <svg
              className="mx-auto mb-6 opacity-30"
              width="80"
              height="60"
              viewBox="0 0 80 60"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 5h26a4 4 0 0 1 4 4v42a3 3 0 0 0-3-3H2z" fill="#D9CEBB" />
              <path d="M78 5H52a4 4 0 0 0-4 4v42a3 3 0 0 1 3-3h27z" fill="#D9CEBB" />
              <rect x="38" y="3" width="4" height="52" rx="2" fill="#C9813A" />
            </svg>
            <h2
              className="mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "22px",
                color: "#1C1612",
              }}
            >
              Your shelf is empty
            </h2>
            <p
              className="mb-6 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#8C7B6B" }}
            >
              Search for books and add them to your reading list.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 text-sm font-medium rounded-[3px]"
              style={{
                background: "#C9813A",
                color: "#1C1612",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Browse Books
            </Link>
          </div>
        )}

        {/* Bulk actions toolbar */}
        {selected.size > 0 && (
          <div
            className="mb-6 flex items-center gap-4 px-4 py-3 rounded-[6px]"
            style={{
              background: "#EDE6D6",
              border: "1px solid #D9CEBB",
              boxShadow: "4px 6px 20px rgba(28,22,18,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "12px",
                color: "#8C7B6B",
              }}
            >
              {selected.size} selected
            </span>
            <button
              onClick={selectAll}
              className="text-xs hover:underline transition-colors"
              style={{ fontFamily: "'DM Mono', monospace", color: "#C9813A" }}
            >
              Select all
            </button>
            <button
              onClick={clearSelection}
              className="text-xs hover:underline"
              style={{ fontFamily: "'DM Mono', monospace", color: "#8C7B6B" }}
            >
              Clear
            </button>
            <button
              onClick={removeSelected}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-medium transition-colors hover:brightness-90"
              style={{
                background: "#9B3D2B",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <MdDeleteForever size={14} /> Remove selected
            </button>
          </div>
        )}

        {/* Book grid / list */}
        {displayed.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {displayed.map((book, i) => (
              <div key={book.key || i} className="relative">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(book.key)}
                  className="absolute top-2 left-3 z-20 text-base transition-colors"
                  style={{ color: selected.has(book.key) ? "#C9813A" : "#D9CEBB" }}
                  aria-label="Select book"
                >
                  {selected.has(book.key) ? <FiCheckSquare /> : <FiSquare />}
                </button>
                <BookCard
                  book={{ ...book, id: i }}
                  index={i}
                  isInList={true}
                />
              </div>
            ))}
          </div>
        )}

        {displayed.length > 0 && viewMode === "list" && (
          <div className="flex flex-col gap-3">
            {displayed.map((book, i) => (
              <div
                key={book.key || i}
                className="flex items-center gap-4 p-4 rounded-[6px] transition-all duration-200 hover:shadow-medium"
                style={{
                  background: "#EDE6D6",
                  border: "1px solid #D9CEBB",
                  boxShadow: "4px 6px 20px rgba(28,22,18,0.06)",
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(book.key)}
                  style={{ color: selected.has(book.key) ? "#C9813A" : "#D9CEBB" }}
                  className="flex-shrink-0 text-lg transition-colors"
                >
                  {selected.has(book.key) ? <FiCheckSquare /> : <FiSquare />}
                </button>

                {/* Cover thumbnail */}
                <div
                  className="flex-shrink-0 rounded-[3px] overflow-hidden"
                  style={{ width: 48, height: 68 }}
                >
                  {book.coverImg ? (
                    <img
                      src={book.coverImg}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "#D9CEBB" }}
                    >
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "16px",
                          color: "#C9813A",
                        }}
                      >
                        {book.title?.slice(0, 1) || "?"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="truncate mb-0.5"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "#1C1612",
                    }}
                  >
                    {book.title}
                  </h3>
                  {book.author_name && (
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "12px",
                        color: "#8C7B6B",
                      }}
                    >
                      {book.author_name.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeOne(book.key)}
                  className="flex-shrink-0 p-1.5 rounded transition-colors hover:text-rust"
                  style={{ color: "#D9CEBB" }}
                  aria-label="Remove"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

  if (bookDetails.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-textSecondary mb-4">Your reading list is empty.</p>
        <Link to="/" className="text-primary font-medium">
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-section font-bold">Reading List</h2>
        <div className="space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-2 py-1 rounded ${
              viewMode === "grid" ? "bg-primary text-white" : "bg-border"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-2 py-1 rounded ${
              viewMode === "list" ? "bg-primary text-white" : "bg-border"
            }`}
          >
            List
          </button>
        </div>
      </div>
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : ""
        }`}
      >
        {bookDetails.map((book, i) => (
          <div
            key={i}
            className="relative bg-surface rounded-lg shadow-low p-4 flex items-center gap-4"
          >
            <img
              src={book.coverImg || bookIcon}
              alt={book.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-body font-medium truncate">{book.title}</h3>
            </div>
            <button
              onClick={() => handleDelete(book.key)}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove from list"
            >
              <MdDeleteForever size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
