import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";
import BookCard from "../components/BookCard";

// Decorative background spine rectangles (CSS-only, low opacity)
const SpineDecorations = () => {
  const spines = [
    { h: 120, w: 14, top: "12%", left: "5%",  rot: -12, color: "#C9813A" },
    { h: 90,  w: 11, top: "60%", left: "3%",  rot:  8,  color: "#9B3D2B" },
    { h: 140, w: 16, top: "25%", left: "92%", rot:  14, color: "#4A6741" },
    { h: 80,  w: 10, top: "70%", left: "88%", rot: -6,  color: "#C9813A" },
    { h: 100, w: 13, top: "82%", left: "10%", rot:  10, color: "#4A6741" },
    { h: 110, w: 12, top: "15%", left: "80%", rot: -16, color: "#9B3D2B" },
  ];
  return (
    <>
      {spines.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            height: s.h,
            width: s.w,
            top: s.top,
            left: s.left,
            background: s.color,
            borderRadius: "2px",
            transform: `rotate(${s.rot}deg)`,
            opacity: 0.1,
          }}
        />
      ))}
    </>
  );
};

export default function Home({ query, books, setQuery, setBooks, readLater, setReadLater }) {
  const [visible, setVisible] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(201,129,58,0.12) 0%, transparent 65%), #1C1612",
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            opacity: 0.6,
          }}
        />

        {/* Spine decorations */}
        <SpineDecorations />

        {/* Hero content */}
        <div
          className={`relative z-10 text-center max-w-3xl mx-auto transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p
            className="mb-4 text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: "#C9813A",
            }}
          >
            Your Reading Corner
          </p>
          <h1
            className="mb-6 leading-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(36px, 6vw, 64px)",
              color: "#F5F0E8",
              letterSpacing: "-0.01em",
            }}
          >
            Find your next<br />great read.
          </h1>
          <p
            className="mb-10 text-base"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              color: "rgba(245,240,232,0.6)",
              letterSpacing: "0.01em",
            }}
          >
            Discover millions of titles from the world's largest open library.
          </p>

          <SearchBar
            query={query}
            setQuery={(q) => {
              setQuery(q);
              if (q.length >= 3) handleSearch();
            }}
          />

          {/* Scroll hint */}
          {books.length > 0 && (
            <button
              onClick={handleSearch}
              className="mt-8 text-xs tracking-widest uppercase transition-opacity hover:opacity-100 opacity-50"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: "#C9813A",
                border: "none",
                background: "none",
              }}
            >
              ↓ View results
            </button>
          )}
        </div>
      </section>

      {/* ── SEARCH RESULTS ── */}
      {books.length > 0 && (
        <section
          ref={resultsRef}
          className="max-w-container mx-auto px-6 py-16"
          style={{ background: "#F5F0E8" }}
        >
          <div className="mb-8">
            <h2 className="section-heading text-2xl">
              Results for &ldquo;{query}&rdquo;
            </h2>
          </div>
          <BookList
            books={books}
            query={query}
            setBooks={setBooks}
            readLater={readLater}
            setReadLater={setReadLater}
          />
        </section>
      )}

      {/* ── EMPTY SEARCH PROMPT / TRENDING PLACEHOLDER ── */}
      {books.length === 0 && (
        <section
          className="max-w-container mx-auto px-6 py-16"
          style={{ background: "#F5F0E8" }}
        >
          <BookList
            books={books}
            query={query}
            setBooks={setBooks}
            readLater={readLater}
            setReadLater={setReadLater}
          />
        </section>
      )}

      {/* ── READING LIST PREVIEW ── */}
      {readLater && readLater.length > 0 && (
        <section
          className="py-16"
          style={{ background: "#EDE6D6" }}
        >
          <div className="max-w-container mx-auto px-6">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="section-heading text-2xl">Continue Reading</h2>
              <a
                href="/read"
                className="text-xs tracking-widest uppercase hover:underline"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "#C9813A",
                }}
              >
                View all →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {readLater.slice(0, 5).map((book, i) => (
                <BookCard
                  key={book.key || i}
                  book={{ ...book, id: i }}
                  index={i}
                  isInList={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EDITORIAL QUOTE (shown when no reading list) ── */}
      {(!readLater || readLater.length === 0) && (
        <section
          className="py-20 text-center"
          style={{ background: "#EDE6D6" }}
        >
          <blockquote
            className="max-w-xl mx-auto px-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: "#1C1612",
              lineHeight: 1.6,
            }}
          >
            &ldquo;A reader lives a thousand lives before he dies. The man who never reads lives only one.&rdquo;
          </blockquote>
          <p
            className="mt-4 text-xs tracking-widest uppercase"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: "#8C7B6B",
            }}
          >
            — George R.R. Martin
          </p>
        </section>
      )}
    </div>
  );
}
