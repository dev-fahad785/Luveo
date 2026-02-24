import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, category: "Women's Bags",      image: "https://images.pexels.com/photos/23223837/pexels-photo-23223837.jpeg?_gl=1*su7qjh*_ga*MTEyMzM2ODEyNy4xNzcxNjY5OTAy*_ga_8JE65Q40S6*czE3NzE2Njk5MDIkbzEkZzEkdDE3NzE2NzA5NDQkajQzJGwwJGgw"        },
  { id: 2, category: "Men's Wallets", image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    },
  { id: 3, category: "Leather Belts",   image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"     },
  { id: 4, category: "Accessories",  image: "https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"   },
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
    <section style={{ padding: "0 clamp(20px, 5vw, 80px) 80px", background: "var(--prada-off-white)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "clamp(16px, 3vw, 32px)",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {categories.map((item, idx) => (
          <CategoryPanel
            key={item.id}
            item={item}
            idx={idx}
            ref={el => (itemsRef.current[idx] = el)}
            onClick={() => navigate(`/products/${item.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`)}
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
          animation: pradaReveal 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {/* Container image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
          background: "var(--prada-light-gray)",
          borderRadius: "var(--radius-md)", // Added rounded corners
          boxShadow: hovered ? "0 10px 30px rgba(0,0,0,0.1)" : "0 4px 6px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.4s ease",
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
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
        />
      </div>

      {/* Label below image */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "var(--prada-black)",
            margin: "0 0 6px",
            transition: "color 0.2s",
          }}
        >
          {item.category}
        </p>
        <span
          style={{
            display: "inline-block",
            height: 2, // Thicker underline
            width: hovered ? "40px" : "20px",
            background: hovered ? "var(--brand-accent)" : "var(--prada-mid-gray)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
});

CategoryPanel.displayName = "CategoryPanel";

export default Explore;