import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({ query, setQuery }) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== query) setQuery(localQuery);
    }, 500); // debounce 500ms
    return () => clearTimeout(handler);
  }, [localQuery]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary">
        <IoIosSearch />
      </span>
      <input
        type="text"
        aria-label="Search books"
        placeholder="Search for books..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="w-full py-3 pl-12 pr-4 rounded-full border border-border bg-surface text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
      />
    </div>
  );
}
