import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import bookIcon from '../Pages/book-icon.png';

export default function Read({ readLater, setReadLater }) {
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [bookDetails, setBookDetails] = useState([]);

  useEffect(() => {
    setBookDetails(readLater);
  }, [readLater]);

  const handleDelete = (bookId) => {
    setReadLater((prev) => prev.filter((b) => b.key !== bookId));
  };

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
            onClick={() => setViewMode('grid')}
            className={`px-2 py-1 rounded ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'bg-border'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-1 rounded ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-border'
            }`}
          >
            List
          </button>
        </div>
      </div>
      <div
        className={`${
          viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : ''
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
