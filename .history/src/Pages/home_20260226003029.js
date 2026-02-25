import React from "react";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";

export default function Home({ query, books, setQuery, setBooks }) {
  return (
    <div className="pt-20">
      {/* hero */}
      <section className="bg-primary/10 py-20 text-center">
        <h1 className="text-hero font-bold text-textPrimary">
          Your Ideal Book Corner
        </h1>
        <p className="mt-4 text-body text-textSecondary">
          Discover your favorite reads in one place.
        </p>
        <div className="mt-8">
          <SearchBar query={query} setQuery={setQuery} />
        </div>
      </section>

      {/* results */}
      <section className="max-w-container mx-auto px-6 py-12">
        <BookList books={books} query={query} setBooks={setBooks} />
      </section>
    </div>
  );
}
