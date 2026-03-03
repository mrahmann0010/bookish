import React from "react";

/**
 * Button — Literary Editorial variants
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 */
export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-sans font-medium text-sm tracking-wide " +
    "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 " +
    "focus:ring-amber active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed " +
    "px-6 py-2.5 rounded-[3px]";

  const variants = {
    primary:
      "bg-amber text-ink hover:bg-rust focus:ring-amber shadow-low hover:shadow-medium",
    secondary:
      "bg-transparent border border-amber border-[1.5px] text-amber " +
      "hover:bg-amber/10 focus:ring-amber",
    ghost:
      "bg-transparent border-none text-muted hover:text-ink focus:ring-amber",
    danger:
      "bg-rust text-white hover:bg-[#7a2e1e] focus:ring-rust shadow-low",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
