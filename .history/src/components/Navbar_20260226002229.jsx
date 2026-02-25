import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoLibraryOutline, IoMenu, IoClose } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-surface shadow-medium z-50">
      <div className="max-w-container mx-auto flex items-center justify-between h-20 px-6">
        <NavLink to="/" className="text-2xl font-bold text-primary">
          Bookish
        </NavLink>
        <nav className="hidden md:flex space-x-8 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary font-semibold' : 'text-textSecondary'
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/read"
            className={({ isActive }) =>
              isActive ? 'text-primary font-semibold' : 'text-textSecondary'
            }
          >
            Reading List
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'text-primary font-semibold' : 'text-textSecondary'
            }
          >
            Profile
          </NavLink>
        </nav>
        <button
          className="md:hidden p-2 text-textSecondary"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="md:hidden bg-surface border-t border-border">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4 text-textPrimary"
          >
            Explore
          </NavLink>
          <NavLink
            to="/read"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4 text-textPrimary"
          >
            Reading List
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="block px-6 py-4 text-textPrimary"
          >
            Profile
          </NavLink>
        </nav>
      )}
    </header>
  );
}
