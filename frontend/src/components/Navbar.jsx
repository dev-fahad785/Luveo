import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const AccountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
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
  { label: "All Products", path: "/all-products" },
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
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
          padding: "9px 16px",
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
        }}
      >
        Complimentary shipping on all orders · Free gift wrapping available
      </div>

      {/* ── Main Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.96)" : "var(--prada-white)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: "1px solid var(--prada-border)",
          transition: "all 0.3s ease",
        }}
      >
        {/* ── Single Row: Logo Left · Nav Centre · Icons Right ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 32px",
            gap: 24,
          }}
        >
          {/* Left — Logo */}
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.25rem, 2.5vw, 1.65rem)",
              fontWeight: 300,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--prada-black)",
              textDecoration: "none",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            LuvEo
          </Link>

          {/* Centre — Nav links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(16px, 3vw, 40px)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {navItems.map(item => (
              <NavLink key={item.label} to={item.path} label={item.label} />
            ))}
          </nav>

          {/* Right — Action icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexShrink: 0,
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
              onMouseEnter={e => e.currentTarget.style.opacity = "0.5"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <AccountIcon />
            </Link>

            <Link
              to="/profile"
              aria-label="Cart"
              style={{ color: "var(--prada-black)", display: "flex", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.5"}
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
              padding: "14px 40px",
              background: "var(--prada-white)",
            }}
          >
            <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
              <input
                autoFocus
                type="text"
                placeholder="Search for products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid var(--prada-black)",
                  outline: "none",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  padding: "6px 0",
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
                  fontSize: "1.1rem",
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
        fontSize: "0.62rem",
        fontWeight: 400,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--prada-black)",
        textDecoration: "none",
        paddingBottom: "3px",
        borderBottom: hovered ? "1px solid var(--prada-black)" : "1px solid transparent",
        transition: "border-color 0.25s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  );
};

export default Navbar;