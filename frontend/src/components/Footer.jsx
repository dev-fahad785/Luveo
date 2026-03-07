// import React from "react";
import { Link } from "react-router-dom";

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

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.8 5.5c-.7.3-1.5.5-2.3.6a3.6 3.6 0 001.6-2 7 7 0 01-2.3.9 3.5 3.5 0 00-6 2.4c0 .3 0 .6.1.8a10 10 0 01-7.3-3.7 3.5 3.5 0 001.1 4.7c-.5 0-1-.2-1.4-.4a3.5 3.5 0 002.8 3.5 3.6 3.6 0 01-1.4.1 3.5 3.5 0 003.3 2.4A7 7 0 013 18.6a9.9 9.9 0 005.4 1.6c6.5 0 10-5.4 10-10v-.4c.7-.5 1.3-1.1 1.8-1.8z" />
  </svg>
);

const NAV = {
  Support: [
    { label: "Contact Us", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refunds & Returns", href: "#" },
    { label: "Shipping", href: "#" },
  ],
  "Quick Links": [
    { label: "Magnetic wallets", href: "#" },
    { label: "Ultra Slim", href: "#" },
    { label: "Premium Long wallets", href: "#" },
    { label: "Travel", href: "#" },
    { label: "Accessories", href: "#" },
    { label: "Briefcases and Luggage", href: "#" },
    { label: "Shop All", href: "#" },
  ],
  "Sales Explore": [],
};

const Footer = () => {
  return (
    <footer className="bg-transparent">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 pb-16 pt-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr_1fr_1.2fr]">
          {Object.entries(NAV).map(([title, items]) => (
            <div key={title} className="text-left">
              <p className="mb-4 font-sans text-[15px] font-semibold tracking-[0.06em] text-black">
                {title}
              </p>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.label} className="text-[15px] font-medium text-[#1a1a1a]">
                    <a href={item.href} className="transition-colors hover:text-black/70">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="flex flex-col gap-4 text-left md:items-start">
            <p className="font-sans text-[14px] font-semibold text-black">
              Explore With us! Sign up to receive exclusive access to product drops, company news, and more.
            </p>
            <form className="flex w-full max-w-[420px] gap-2" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 text-[15px] font-medium text-black outline-none focus:border-black"
              />
              <button
                type="submit"
                className="rounded-[12px] bg-black px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1a1a1a]"
              >
                Submit
              </button>
            </form>

            <div className="flex items-center gap-4 pt-2 text-black">
              <a href="https://www.facebook.com" aria-label="Facebook" className="transition hover:text-black/60">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com" aria-label="Instagram" className="transition hover:text-black/60">
                <InstagramIcon />
              </a>
              <a href="https://www.twitter.com" aria-label="Twitter" className="transition hover:text-black/60">
                <TwitterIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 text-center text-[12px] font-medium text-black/60 md:flex-row md:text-left">
          <Link to="/" className="font-serif text-[18px] font-bold tracking-[0.12em] uppercase text-black">Luveo</Link>
          <p>© {new Date().getFullYear()} Luveo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
