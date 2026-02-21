import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, category: "women bags",      image: "https://images.pexels.com/photos/23223837/pexels-photo-23223837.jpeg?_gl=1*su7qjh*_ga*MTEyMzM2ODEyNy4xNzcxNjY5OTAy*_ga_8JE65Q40S6*czE3NzE2Njk5MDIkbzEkZzEkdDE3NzE2NzA5NDQkajQzJGwwJGgw"        },
  { id: 2, category: "Men Wallet", image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    },
  { id: 3, category: "Lather Belts",   image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"     },
  { id: 4, category: "Perfume",  image: "https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"   },
];

const Explore = () => {
  const navigate = useNavigate();
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("prada-reveal-in");
      }),
      { threshold: 0.15 }
    );
    itemsRef.current.forEach(el => el && observer.observe(el));
    return () => itemsRef.current.forEach(el => el && observer.unobserve(el));
  }, []);

  return (
    <section style={{ padding: "0 clamp(20px, 5vw, 80px) 80px", background: "var(--prada-white)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "clamp(12px, 2vw, 28px)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {categories.map((item, idx) => (
          <CategoryPanel
            key={item.id}
            item={item}
            idx={idx}
            ref={el => (itemsRef.current[idx] = el)}
            onClick={() => navigate(`/products/${item.category.toLowerCase()}`)}
          />
        ))}
      </div>

      <style>{`
        .prada-category-panel {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0 ease, transform 0 ease;
        }
        .prada-reveal-in {
          animation: pradaReveal 0.7s ease forwards;
        }
        @keyframes pradaReveal {
          to { opacity: 1; transform: translateY(0); }
        }
        .prada-category-panel:nth-child(1) { animation-delay: 0s; }
        .prada-category-panel:nth-child(2) { animation-delay: 0.1s; }
        .prada-category-panel:nth-child(3) { animation-delay: 0.2s; }
        .prada-category-panel:nth-child(4) { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
};

const CategoryPanel = React.forwardRef(({ item, onClick }, ref) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="prada-category-panel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Tall portrait image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2/3",
          overflow: "hidden",
          background: "var(--prada-off-white)",
        }}
      >
        <img
          src={item.image}
          alt={item.category}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>

      {/* Label below image */}
      <div style={{ paddingTop: 14, textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.62rem",
            fontWeight: 400,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--prada-black)",
            margin: "0 0 4px",
          }}
        >
          {item.category}
        </p>
        <span
          style={{
            display: "inline-block",
            height: 1,
            width: hovered ? "60%" : "0%",
            background: "var(--prada-black)",
            transition: "width 0.35s ease",
          }}
        />
      </div>
    </div>
  );
});

CategoryPanel.displayName = "CategoryPanel";

export default Explore;