import React from "react";

export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-surface rounded-2xl shadow-low hover:shadow-medium transition p-4 ${className}`}
  >
    {children}
  </div>
);
