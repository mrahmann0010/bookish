import React from "react";

export default function SkeletonCard() {
  return (
    <div
      className="relative overflow-hidden rounded-[6px] border border-border"
      style={{ boxShadow: "4px 6px 20px rgba(28,22,18,0.08)" }}
    >
      {/* Left spine strip placeholder */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ background: "#c8b8a2" }}
      />

      {/* Cover area */}
      <div
        className="skeleton-shimmer"
        style={{ paddingLeft: "8px", paddingTop: "0" }}
      >
        <div
          className="skeleton-shimmer w-full"
          style={{ aspectRatio: "2/3", minHeight: "180px" }}
        />
      </div>

      {/* Bottom panel */}
      <div
        className="p-3"
        style={{ background: "#EDE6D6" }}
      >
        <div
          className="skeleton-shimmer h-4 rounded mb-2"
          style={{ width: "80%" }}
        />
        <div
          className="skeleton-shimmer h-3 rounded mb-3"
          style={{ width: "55%" }}
        />
        <div
          className="skeleton-shimmer h-2.5 rounded"
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}
