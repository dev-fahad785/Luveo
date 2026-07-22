import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const categories = [
  { id: 1, category: "Magnetic Wallet", value: "magnetic-wallet", image: "https://www.waldorleather.com/cdn/shop/collections/E0127C8F-00FD-4D9A-B501-9DBC77D98CAC.jpg?v=1769830638&width=535", hero: true },
  { id: 2, category: "Long Wallet", value: "long-wallet", image: "https://www.waldorleather.com/cdn/shop/collections/Untitled_design-59.png?v=1770982930&width=535" },
  { id: 3, category: "Classic Wallets", value: "men-wallets", image: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?q=80&w=1025&auto=format&fit=crop" },
  { id: 4, category: "Leather Belts", value: "leather-belts", image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?q=80&w=1170&auto=format&fit=crop" },
  { id: 5, category: "Women's Bags", value: "women-bags", image: "https://images.pexels.com/photos/23223837/pexels-photo-23223837.jpeg" },
  { id: 6, category: "Laptop Covers", value: "accessories", image: "https://images.unsplash.com/photo-1611461527944-1a718332613b?q=80&w=688&auto=format&fit=crop" },
  { id: 7, category: "Bags & Briefcase", value: "accessories", image: "https://images.unsplash.com/photo-1735705050903-b92f919cdd80?q=80&w=1470&auto=format&fit=crop" },
  { id: 8, category: "Accessories", value: "accessories", image: "https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=687&auto=format&fit=crop" },
];

const springEase = [0.16, 1, 0.3, 1];

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: springEase },
  }),
};

const Explore = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {categories.map((item, idx) => {
          const isHero = item.hero;

          if (isHero) {
            return (
              <motion.div
                key={item.id}
                custom={idx}
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={slideUp}
                className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
                onClick={() => navigate("/products/" + item.value)}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ backgroundImage: "url(" + item.image + ")" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                <div className="relative h-full min-h-[400px] md:min-h-full flex flex-col justify-end p-7 md:p-9">
                  <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-white/50">Featured</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 leading-tight tracking-tight">
                    {item.category}
                  </h3>
                  <div className="flex items-center gap-2 mt-4 text-white/80 text-xs font-semibold tracking-[0.08em] uppercase group-hover:text-white transition-colors">
                    <span>Discover</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </div>
                </div>
              </motion.div>
            );
          }

          const isLastRow = idx >= 7;

          if (isLastRow) {
            return (
              <motion.div
                key={item.id}
                custom={idx}
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={slideUp}
                className="md:col-span-2 lg:col-span-4 relative group cursor-pointer overflow-hidden border-t border-[var(--prada-border)] pt-6 md:pt-8 mt-2 md:mt-4"
                onClick={() => navigate("/products/" + item.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--prada-black)] tracking-tight">
                      {item.category}
                    </h3>
                    <span className="text-xs text-[var(--prada-mid-gray)] mt-1 block">Explore all &rarr;</span>
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: "url(" + item.image + ")" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.id}
              custom={idx}
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideUp}
              className="relative group cursor-pointer overflow-hidden aspect-[4/5]"
              onClick={() => navigate("/products/" + item.value)}
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ backgroundImage: "url(" + item.image + ")" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-5">
                <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                  {item.category}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
