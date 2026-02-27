import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, category: "Women's Bags", value:'women-bags',     image: "https://images.pexels.com/photos/23223837/pexels-photo-23223837.jpeg?_gl=1*su7qjh*_ga*MTEyMzM2ODEyNy4xNzcxNjY5OTAy*_ga_8JE65Q40S6*czE3NzE2Njk5MDIkbzEkZzEkdDE3NzE2NzA5NDQkajQzJGwwJGgw"        },
  { id: 2, category: "Men's Wallets", value:'men-wallets', image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    },
  { id: 3, category: "Leather Belts", value:'leather-belts',   image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"     },
  { id: 4, category: "Accessories", value:'accessories',  image: "https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"   },
];

const Explore = () => {
  const navigate = useNavigate();
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    itemsRef.current.forEach(el => el && observer.observe(el));
    return () => itemsRef.current.forEach(el => el && observer.unobserve(el));
  }, []);

  return (
    <section className="bg-[#f7f7f7] pb-20 px-[clamp(20px,5vw,80px)]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[clamp(16px,3vw,32px)]">
        {categories.map((item, idx) => (
          <CategoryPanel
            key={item.id}
            item={item}
            idx={idx}
            ref={el => (itemsRef.current[idx] = el)}
            onClick={() => navigate(`/products/${item.value}`)}
          />
        ))}
      </div>

    </section>
  );
};

const CategoryPanel = React.forwardRef(({ item, onClick }, ref) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`opacity-0 translate-y-7 transition-all duration-700 ease-out cursor-pointer flex flex-col gap-4`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Container with background image and overlay text */}
      <div
        className={`relative w-full aspect-[4/5] overflow-hidden bg-[#ededed] rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition duration-400 ${hovered ? "shadow-[0_10px_30px_rgba(0,0,0,0.1)]" : ""}`}
      >
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ${hovered ? "scale-[1.04]" : "scale-100"}`}
          style={{ backgroundImage: `url(${item.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6 px-4 text-center">
          <p className="font-sans text-white text-base font-bold tracking-[0.05em] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            {item.category}
          </p>
          <span
            className={`h-[2px] rounded-full transition-all duration-300 ${hovered ? "w-10 bg-[#e53945]" : "w-5 bg-white/70"}`}
          />
        </div>
      </div>
    </div>
  );
});

CategoryPanel.displayName = "CategoryPanel";

export default Explore;