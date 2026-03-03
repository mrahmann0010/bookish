import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { FiSearch, FiUser } from "react-icons/fi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-xs tracking-widest uppercase font-medium transition-colors duration-200 ${
      isActive
        ? "text-amber border-b border-amber pb-0.5"
        : "text-paper/70 hover:text-paper"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : ""
      }`}
      style={{
        background: "#1C1612",
        borderBottom: "3px solid #C9813A",
      }}
    >
      <div
        className="max-w-container mx-auto flex items-center justify-between px-6"
        style={{ height: "64px" }}
      >
        {/* Wordmark */}
        <NavLink
          to="/"
          className="text-amber text-[28px] leading-none select-none"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          Bookish
        </NavLink>

        {/* Desktop nav: center */}
        <nav className="hidden md:flex items-center space-x-10">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/read" className={navLinkClass}>
            My List
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </nav>

        {/* Right icons */}
        <div className="hidden md:flex items-center space-x-5 text-paper/70">
          <NavLink
            to="/"
            title="Search"
            className="hover:text-amber transition-colors"
          >
            <FiSearch size={18} />
          </NavLink>
          <NavLink
            to="/profile"
            title="Profile"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-amber/40 hover:border-amber transition-colors"
          >
            <FiUser size={15} className="text-paper/80" />
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-paper/80 hover:text-amber transition-colors p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <IoClose size={22} /> : <IoMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          className="md:hidden mobile-drawer"
          style={{
            background: "#1C1612",
            borderTop: "1px solid rgba(201,129,58,0.2)",
          }}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/read", label: "My List" },
            { to: "/profile", label: "Profile" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-4 text-xs uppercase tracking-widest font-medium border-b transition-colors ${
                  isActive
                    ? "text-amber border-amber/20"
                    : "text-paper/70 hover:text-amber border-paper/5"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
