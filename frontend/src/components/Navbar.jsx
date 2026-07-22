import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const iconProps = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.5 };

const SearchIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const AccountIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

const CartIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const navItems = [
  { label: "New Arrivals", path: "/" },
  { label: "Men", path: "/products/men" },
  { label: "Women", path: "/products/women" },
  { label: "Gifting", path: "/products/gifting" },
  { label: "Explore All", path: "/all-products" },
];

const springEase = [0.16, 1, 0.3, 1];

const Navbar = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => {
      setScrolled(y > 60);
    });
    return () => unsub();
  }, [scrollY]);

  const isOverHero = transparent && !scrolled;
  const textColor = isOverHero ? "var(--prada-white)" : "var(--prada-black)";
  const borderColor = isOverHero ? "rgba(255,255,255,0.15)" : "var(--prada-border)";
  const bgColor = isOverHero
    ? "transparent"
    : "rgba(255,255,255,0.98)";
  const mobileBg = scrolled ? "rgba(255,255,255,0.98)" : "rgba(18,18,18,0.98)";

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="bg-[var(--prada-black)] text-[var(--prada-white)] text-xs tracking-[0.05em] text-center py-2.5 px-4 font-semibold overflow-hidden"
        animate={{ height: mobileOpen ? 0 : "auto", opacity: mobileOpen ? 0 : 1 }}
        transition={{ duration: 0.3, ease: springEase }}
      >
        Complimentary shipping on all orders · <span className="text-[var(--brand-accent)]">Shop the Sale</span>
      </motion.div>

      <motion.header
        className="border-b transition-none"
        style={{ borderColor, backgroundColor: bgColor, backdropFilter: scrolled ? "blur(12px)" : "blur(0px)" }}
      >
        <div className="flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto] px-4 sm:px-6 md:px-10 py-3 md:py-4 max-w-[1440px] mx-auto gap-4 md:gap-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Link
              to="/"
              className="font-bold tracking-[0.15em] uppercase select-none text-[clamp(1.5rem,2.5vw,2rem)]"
              style={{ color: textColor }}
            >
              LuvEo
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.path} label={item.label} color={textColor} />
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 md:gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              style={{ color: textColor }}
              className="flex"
            >
              <SearchIcon />
            </motion.button>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/profile" aria-label="Account" style={{ color: textColor }} className="flex">
                <AccountIcon />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/profile" aria-label="Cart" style={{ color: textColor }} className="flex">
                <CartIcon />
              </Link>
            </motion.div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              className="md:hidden flex flex-col gap-[5px] items-center justify-center w-6 h-6 relative"
              style={{ color: textColor }}
            >
              <motion.span
                className="block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: springEase }}
              />
              <motion.span
                className="block w-5 h-[1.5px] bg-current rounded-full"
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: springEase }}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: springEase }}
              className="md:hidden border-t overflow-hidden"
              style={{ borderColor, backgroundColor: mobileBg, backdropFilter: "blur(12px)" }}
            >
              <div className="px-4 sm:px-6 py-4 space-y-3">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: springEase }}
                  >
                    <Link
                      to={item.path}
                      className="block text-sm font-semibold tracking-[0.05em] uppercase"
                      style={{ color: isOverHero ? "var(--prada-white)" : "var(--prada-black)" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: springEase }}
              className="border-t overflow-hidden"
              style={{ borderColor, backgroundColor: bgColor, backdropFilter: scrolled ? "blur(12px)" : "blur(0px)" }}
            >
              <div className="px-4 sm:px-6 md:px-10 py-5">
                <div className="max-w-[600px] mx-auto relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-0 border-b-2 outline-none text-base tracking-[0.05em] py-2.5 bg-transparent"
                    style={{
                      borderColor: textColor,
                      color: textColor,
                      caretColor: textColor,
                    }}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl leading-none"
                    style={{ color: isOverHero ? "rgba(255,255,255,0.6)" : "var(--prada-gray)" }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

const NavLink = ({ to, label, color }) => (
  <Link to={to} className="relative group py-1">
    <span className="text-sm font-semibold tracking-[0.05em] uppercase" style={{ color }}>
      {label}
    </span>
    <motion.span
      className="absolute bottom-0 left-0 h-[2px] bg-current origin-left"
      style={{ color }}
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3, ease: springEase }}
    />
  </Link>
);

export default Navbar;
