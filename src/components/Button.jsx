import React from "react";

export const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-xl bg-primary text-white font-medium 
      hover:bg-primary/90 transition shadow-low hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
    {...props}
  >
    {children}
  </button>
);
