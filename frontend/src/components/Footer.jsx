import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AccordionSection = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "18px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--prada-white)",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          {title}
        </span>
        <span style={{
          fontSize: "1rem", fontWeight: 200,
          transition: "transform 0.3s ease",
          transform: open ? "rotate(45deg)" : "none",
          lineHeight: 1,
        }}>
          +
        </span>
      </button>
      {open && (
        <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(item => (
            <li key={item.label}>
              <a
                href={item.href}
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "0.7rem",
                  letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)",
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TiktokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.86a4.85 4.85 0 01-1.01-.17z"/>
  </svg>
);

const SECTIONS = [
  {
    title: "Company",
    items: [
      { label: "About Luveo", href: "#" },
      { label: "Careers",     href: "#" },
      { label: "Press",       href: "#" },
    ],
  },
  {
    title: "Customer Service",
    items: [
      { label: "My Account",          href: "/profile" },
      { label: "Shipping & Delivery", href: "#" },
      { label: "Returns & Exchanges", href: "#" },
      { label: "Contact Us",          href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy",  href: "#" },
      { label: "Terms of Use",    href: "#" },
      { label: "Cookie Policy",   href: "#" },
    ],
  },
];

const SOCIALS = [
  { Icon: InstagramIcon, href: "https://www.instagram.com/glowzlifestyle/",                label: "Instagram" },
  { Icon: FacebookIcon,  href: "https://www.facebook.com/profile.php?id=61558535894505",   label: "Facebook"  },
  { Icon: TiktokIcon,    href: "https://www.tiktok.com/@glowzlifestyle1",                  label: "TikTok"    },
];

const Footer = () => (
  <footer style={{ background: "var(--prada-black)", color: "var(--prada-white)", padding: "60px clamp(20px, 6vw, 100px) 0" }}>
    {/* Logo */}
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <Link
        to="/"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 300,
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "var(--prada-white)",
          textDecoration: "none",
        }}
      >
        LuvEo
      </Link>
    </div>

    {/* Accordion columns */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "0 clamp(24px, 5vw, 80px)",
      maxWidth: 960,
      margin: "0 auto 40px",
    }}>
      {SECTIONS.map(s => <AccordionSection key={s.title} title={s.title} items={s.items} />)}
    </div>

    {/* Social icons */}
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: 32,
      padding: "32px 0",
      borderTop: "1px solid rgba(255,255,255,0.15)",
    }}>
      {SOCIALS.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          style={{
            color: "rgba(255,255,255,0.55)",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
        >
          <Icon />
        </a>
      ))}
    </div>

    {/* Bottom row */}
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "20px 0",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.6rem",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.35)",
        margin: 0,
      }}>
        © {new Date().getFullYear()} Luveo. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
