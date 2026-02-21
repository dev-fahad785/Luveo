import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1531190260877-c8d11eb5afaf?q=80&w=1470&auto=format&fit=crop",
    category: "New Arrivals",
    title: "Everyday Luxury",
    cta: "Discover the Collection",
    ctaPath: "/all-products",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?q=80&w=1170&auto=format&fit=crop",
    category: "Women",
    title: "Crafted to Carry More",
    cta: "Shop Women",
    ctaPath: "/products/women",
    align: "center",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1726769202190-ad2a3f2f360b?q=80&w=1170&auto=format&fit=crop",
    category: "Men",
    title: "Weekend Ready",
    cta: "Shop Men",
    ctaPath: "/products/men",
    align: "right",
  },
  {
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1170&auto=format&fit=crop",
    category: "Gifting",
    title: "The Art of Giving",
    cta: "Explore Gifts",
    ctaPath: "/products/gifting",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1586579724969-2cb96841bcb8?q=80&w=1089&auto=format&fit=crop",
    category: "Essentials",
    title: "Corporate Classics",
    cta: "Shop Now",
    ctaPath: "/all-products",
    align: "center",
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
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#fff",
      padding: "8px",
      opacity: 0.75,
      transition: "opacity 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
    onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
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
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#fff",
      padding: "8px",
      opacity: 0.75,
      transition: "opacity 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
    onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
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
    speed: 1000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "ease-in-out",
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

      {/* Slide counter */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 44,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {slides.map((_, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: i === currentSlide ? 28 : 8,
              height: 1,
              background: i === currentSlide ? "#fff" : "rgba(255,255,255,0.45)",
              transition: "width 0.4s ease, background 0.4s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
};

const SlideItem = ({ slide, textVisible }) => {
  const alignMap = {
    left: { alignItems: "flex-start", paddingLeft: "clamp(32px, 10vw, 140px)" },
    center: { alignItems: "center", textAlign: "center" },
    right: { alignItems: "flex-end", paddingRight: "clamp(32px, 10vw, 140px)" },
  };
  const align = alignMap[slide.align] || alignMap.left;

  return (
    <div style={{ position: "relative", height: "clamp(320px, 55vh, 520px)", overflow: "hidden" }}>
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
        }}
      />

      {/* Gradient overlay — subtle bottom-to-top fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
        }}
      />
      {/* Light left edge vignette for left-aligned text */}
      {slide.align === "left" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "clamp(48px, 8vh, 100px)",
          ...align,
        }}
      >
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: slide.align === "center" ? "center" : "flex-start",
            gap: 16,
            maxWidth: 520,
          }}
        >
          {/* Category tag */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ display: "inline-block", width: 28, height: 1, background: "rgba(255,255,255,0.6)" }} />
            {slide.category}
          </span>

          {/* Main title */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "0.06em",
              color: "#fff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {slide.title}
          </h1>

          {/* CTA text-link */}
          <a
            href={slide.ctaPath}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              fontWeight: 400,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#fff",
              textDecoration: "underline",
              textUnderlineOffset: "5px",
              textDecorationThickness: "1px",
              transition: "opacity 0.2s",
              marginTop: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {slide.cta}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
