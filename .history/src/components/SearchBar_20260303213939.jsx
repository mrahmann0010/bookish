import React, { useState, useEffect } from "react";

// Open-book SVG icon (inline, editorial style)
const BookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8C7B6B"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function SearchBar({ query, setQuery }) {
  const [localQuery, setLocalQuery] = useState(query);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== query) setQuery(localQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [localQuery, query, setQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(localQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex items-stretch"
      style={{
        background: "#EDE6D6",
        border: `1.5px solid ${focused ? "#C9813A" : "#D9CEBB"}`,
        borderRadius: "9999px",
        boxShadow: focused
          ? "0 0 0 3px rgba(201,129,58,0.18)"
          : "4px 6px 20px rgba(28,22,18,0.08)",
        transition: "border-color 200ms, box-shadow 200ms",
        overflow: "hidden",
      }}
    >
      {/* Left book icon */}
      <span className="flex items-center pl-5 pr-3 flex-shrink-0">
        <BookIcon />
      </span>

      {/* Input */}
      <input
        type="text"
        aria-label="Search books"
        placeholder="Search for a title, author, or ISBN..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 py-3.5 bg-transparent text-ink placeholder:text-muted/70 focus:outline-none text-base"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontStyle: localQuery ? "normal" : "italic",
        }}
      />

      {/* Search button — flush right, no right radius */}
      <button
        type="submit"
        className="flex-shrink-0 px-6 text-ink text-sm font-medium tracking-wide transition-colors duration-200 hover:brightness-90 focus:outline-none"
        style={{
          background: "#C9813A",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          borderTopRightRadius: "9999px",
          borderBottomRightRadius: "9999px",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        Search
      </button>
    </form>
  );
}
