import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export default function BookCard({ book }) {
  const imgEnd = 'https://covers.openlibrary.org/b/id/';
  const imgSize = '-M.jpg';
  const coverUrl = book.cover_i ? `${imgEnd}${book.cover_i}${imgSize}` : '/placeholder.png';

  return (
    <Link
      to={`/${book.id}`}
      className="group block">
      <div className="relative overflow-hidden rounded-lg shadow-low group-hover:shadow-medium transition transform group-hover:scale-105 bg-white">
        <img
          src={coverUrl}
          alt={book.title}
          loading="lazy"
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h4 className="text-body font-semibold text-textPrimary truncate">
            {book.title}
          </h4>
          <p className="text-small text-textSecondary line-clamp-1">
            {book.author_name?.join(', ') || 'Unknown'}
          </p>
          <div className="flex items-center mt-2">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-small text-textSecondary">
              {book.ratings_average ? book.ratings_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
