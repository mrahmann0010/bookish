import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import SkeletonCard from "./SkeletonCard";

export default function BookList({ query, books, setBooks }) {
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="mb-4">
          <span className="animate-spin inline-block text-primary text-3xl">
            🔄
          </span>
        </div>
        <div className="text-textSecondary text-lg">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  if (books.length === 0) {
    return (
      <p className="text-center text-textSecondary">
        Start typing to search for books.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <li key={book.key}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}
