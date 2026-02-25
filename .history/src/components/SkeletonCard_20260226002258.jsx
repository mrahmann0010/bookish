import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-low p-4">
      <div className="h-40 bg-gray-200 rounded-md mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
