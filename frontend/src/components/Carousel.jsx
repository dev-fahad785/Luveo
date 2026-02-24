import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1531190260877-c8d11eb5afaf?q=80&w=1470&auto=format&fit=crop",
    category: "New Arrivals",
    title: "Everyday Luxury",
    cta: "Shop the Collection",
    ctaPath: "/all-products",
  },
  {
    image: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?q=80&w=1170&auto=format&fit=crop",
    category: "Women's",
    title: "Crafted to Carry More",
    cta: "Shop Women's",
    ctaPath: "/products/women",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1726769202190-ad2a3f2f360b?q=80&w=1170&auto=format&fit=crop",
    category: "Men's",
    title: "Weekend Ready",
    cta: "Shop Men's",
    ctaPath: "/products/men",
  },
  {
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1170&auto=format&fit=crop",
    category: "Gifting",
    title: "The Art of Giving",
    cta: "Explore Gifts",
    ctaPath: "/products/gifting",
  },
  {
    image: "https://images.unsplash.com/photo-1586579724969-2cb96841bcb8?q=80&w=1089&auto=format&fit=crop",
    category: "Essentials",
    title: "Corporate Classics",
    cta: "Shop Now",
    ctaPath: "/all-products",
  },
];

/* Custom slim arrow components */
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Previous"
    style={{
      position: "absolute",
      left: 32,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      cursor: "pointer",
      color: "#fff",
      padding: "12px",
      transition: "background 0.2s, transform 0.2s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
      e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
      e.currentTarget.style.transform = "translateY(-50%) scale(1)";
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Next"
    style={{
      position: "absolute",
      right: 32,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      cursor: "pointer",
      color: "#fff",
      padding: "12px",
      transition: "background 0.2s, transform 0.2s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
      e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
      e.currentTarget.style.transform = "translateY(-50%) scale(1)";
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: () => setTextVisible(false),
    afterChange: (idx) => {
      setCurrentSlide(idx);
      setTimeout(() => setTextVisible(true), 100);
    },
  };

  return (
    <section style={{ position: "relative", width: "100%", background: "#000" }}>
      <Slider {...settings}>
        {slides.map((slide, i) => (
          <SlideItem
            key={slide.image}
            slide={slide}
            isActive={currentSlide === i}
            textVisible={textVisible}
          />
        ))}
      </Slider>

      {/* Slide counter dots underneath */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === currentSlide ? 32 : 12,
              height: 4,
              borderRadius: 2,
              background: i === currentSlide ? "#fff" : "rgba(255,255,255,0.4)",
              border: "none",
              padding: 0,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
};

const SlideItem = ({ slide, textVisible }) => {
  return (
    <div style={{ position: "relative", height: "clamp(500px, 80vh, 800px)", overflow: "hidden" }}>
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transform: "scale(1.05)",
          animation: "kenburns 15s ease-out infinite alternate",
        }}
      />

      {/* Gradient center overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Centered Text content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            maxWidth: 800,
          }}
        >
          {/* Category tag */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#fff",
              background: "rgba(0,0,0,0.4)",
              padding: "6px 16px",
              borderRadius: "4px",
              backdropFilter: "blur(4px)",
            }}
          >
            {slide.category}
          </span>

          {/* Main title */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "#fff",
              margin: 0,
              lineHeight: 1.1,
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {slide.title}
          </h1>

          {/* CTA Solid Button */}
          <a
            href={slide.ctaPath}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--prada-black)",
              backgroundColor: "#fff",
              padding: "16px 40px",
              borderRadius: "4px",
              textDecoration: "none",
              transition: "transform 0.2s, background-color 0.2s",
              marginTop: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "var(--prada-off-white)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {slide.cta}
          </a>
        </div>
      </div>

      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Carousel;
