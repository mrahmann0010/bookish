import React from "react";

/**
 * Card — cream editorial container with optional titled header
 * Props: title, children, className
 */
export const Card = ({ children, title, className = "" }) => (
  <div
    className={`bg-cream border border-border rounded-[6px] shadow-medium p-6 ${className}`}
    style={{ boxShadow: "4px 6px 20px rgba(28,22,18,0.08)" }}
  >
    {title && (
      <div className="mb-5 pb-3 border-b-2 border-amber">
        <h3
          className="font-serif text-ink text-lg font-semibold leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h3>
      </div>
    )}
    {children}
  </div>
);
