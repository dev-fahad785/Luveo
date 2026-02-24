import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const navItems = [
  { label: "New Arrivals", path: "/" },
  { label: "Men",          path: "/products/men" },
  { label: "Women",        path: "/products/women" },
  { label: "Gifting",      path: "/products/gifting" },
  { label: "Explore All",  path: "/all-products" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        style={{
          background: "var(--prada-black)",
          color: "var(--prada-white)",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
          textAlign: "center",
          padding: "10px 16px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
        }}
      >
        Complimentary shipping on all orders · <span style={{ color: "var(--brand-accent)" }}>Shop the Sale</span>
      </div>

      {/* ── Main Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(253,253,253,0.98)" : "var(--prada-white)",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: "1px solid var(--prada-border)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "16px 40px",
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          {/* Left — Nav links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            {navItems.map(item => (
              <NavLink key={item.label} to={item.path} label={item.label} />
            ))}
          </nav>

          {/* Centre — Logo */}
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--prada-black)",
              textDecoration: "none",
              userSelect: "none",
              textAlign: "center",
            }}
          >
            LuvEo
          </Link>

          {/* Right — Action icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 24,
            }}
          >
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--prada-black)",
                padding: 0,
                display: "flex",
                opacity: searchOpen ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <SearchIcon />
            </button>

            <Link
              to="/profile"
              aria-label="Account"
              style={{ color: "var(--prada-black)", display: "flex", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <AccountIcon />
            </Link>

            <Link
              to="/profile"
              aria-label="Cart"
              style={{ color: "var(--prada-black)", display: "flex", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <CartIcon />
            </Link>
          </div>
        </div>

        {/* ── Search Bar (dropdown) ── */}
        {searchOpen && (
          <div
            style={{
              borderTop: "1px solid var(--prada-border)",
              padding: "20px 40px",
              background: "var(--prada-white)",
            }}
          >
            <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
              <input
                autoFocus
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "2px solid var(--prada-black)",
                  outline: "none",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  padding: "10px 0",
                  fontFamily: "var(--font-sans)",
                  background: "transparent",
                  color: "var(--prada-black)",
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "var(--prada-gray)",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

/* Animated underline nav link */
const NavLink = ({ to, label }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.85rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "var(--prada-black)",
        textDecoration: "none",
        paddingBottom: "4px",
        borderBottom: hovered ? "2px solid var(--prada-black)" : "2px solid transparent",
        transition: "border-color 0.2s ease, color 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  );
};

export default Navbar;