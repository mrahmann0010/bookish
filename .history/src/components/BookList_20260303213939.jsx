import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import SkeletonCard from "./SkeletonCard";
import { Link } from "react-router-dom";

// Open-book empty-state illustration
const EmptyBookSVG = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
    className="mx-auto mb-5"
  >
    <rect x="8" y="16" width="28" height="48" rx="3" fill="#D9CEBB" />
    <rect
      x="12"
      y="20"
      width="20"
      height="2"
      rx="1"
      fill="#8C7B6B"
      opacity="0.5"
    />
    <rect
      x="12"
      y="25"
      width="16"
      height="2"
      rx="1"
      fill="#8C7B6B"
      opacity="0.4"
    />
    <rect x="44" y="16" width="28" height="48" rx="3" fill="#D9CEBB" />
    <rect
      x="48"
      y="20"
      width="20"
      height="2"
      rx="1"
      fill="#8C7B6B"
      opacity="0.5"
    />
    <rect
      x="48"
      y="25"
      width="16"
      height="2"
      rx="1"
      fill="#8C7B6B"
      opacity="0.4"
    />
    <rect
      x="36"
      y="14"
      width="8"
      height="52"
      rx="2"
      fill="#C9813A"
      opacity="0.35"
    />
  </svg>
);

export default function BookList({
  query,
  books,
  setBooks,
  readLater,
  setReadLater,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const endPoint = "https://openlibrary.org/search.json?q=";

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      try {
        setError("");
        setIsLoading(true);
        if (query.length < 3) {
          setBooks([]);
          return;
        }
        const res = await fetch(`${endPoint}${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const tempBooks = data.docs.slice(0, 20).map((item, index) => ({
          id: index,
          title: item.title,
          author_name: item.author_name,
          cover_i: item.cover_i,
          key: item.key,
          first_published: item.first_published_year,
          ratings_average: item.ratings_average,
          subject_facet: item.subject_facet,
          want_to_read_count: item.want_to_read,
        }));
        setBooks(tempBooks);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
    return () => controller.abort();
  }, [query, setBooks]);

  const handleQuickAdd = (book) => {
    if (!setReadLater) return;
    setReadLater((prev) =>
      prev.find((b) => b.key === book.key) ? prev : [...prev, book],
    );
  };

  // Loading skeleton grid
  if (isLoading) {
    return (
      <div>
        <p
          className="mb-6 text-sm tracking-wide"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: "#8C7B6B",
          }}
        >
          Searching for &ldquo;{query}&rdquo;&hellip;
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <p
        className="text-center mt-10 text-sm"
        style={{ color: "#9B3D2B", fontFamily: "'DM Sans', sans-serif" }}
      >
        {error}
      </p>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <EmptyBookSVG />
        <h3
          className="text-xl mb-2"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            color: "#1C1612",
          }}
        >
          Your shelf is empty
        </h3>
        <p
          className="mb-6 text-sm"
          style={{ color: "#8C7B6B", fontFamily: "'DM Sans', sans-serif" }}
        >
          Start searching to add books
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 text-sm font-medium rounded-[3px] text-ink transition-colors hover:brightness-90"
          style={{
            background: "#C9813A",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Explore Books
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book, i) => (
        <li
          key={book.key || i}
          className="stagger-item"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <BookCard
            book={book}
            index={i}
            isInList={readLater?.some((b) => b.key === book.key) ?? false}
            onAdd={setReadLater ? () => handleQuickAdd(book) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
