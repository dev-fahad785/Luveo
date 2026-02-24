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
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--prada-white)",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {title}
        </span>
        <span style={{
          fontSize: "1.2rem", fontWeight: 300,
          transition: "transform 0.3s ease",
          transform: open ? "rotate(45deg)" : "none",
          lineHeight: 1,
        }}>
          +
        </span>
      </button>
      {open && (
        <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(item => (
            <li key={item.label}>
              <a
                href={item.href}
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "0.9rem",
                  letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)",
                  textDecoration: "none", transition: "color 0.2s, transform 0.2s",
                  display: "inline-block"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
  <footer style={{ background: "var(--prada-black)", color: "var(--prada-white)", padding: "80px clamp(20px, 6vw, 100px) 0" }}>
    {/* Logo */}
    <div style={{ textAlign: "center", marginBottom: 64 }}>
      <Link
        to="/"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "0.2em",
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
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "0 clamp(32px, 5vw, 80px)",
      maxWidth: 1080,
      margin: "0 auto 60px",
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
            color: "rgba(255,255,255,0.6)",
            transition: "all 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Icon />
        </a>
      ))}
    </div>

    {/* Bottom row */}
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "24px 0",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.8rem",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.4)",
        margin: 0,
      }}>
        © {new Date().getFullYear()} Luveo. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
