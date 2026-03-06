const slides = [
  {
    image: "https://images.unsplash.com/photo-1531190260877-c8d11eb5afaf?q=80&w=1470&auto=format&fit=crop",
    category: "New Arrivals",
    title: "Everyday Luxury",
    cta: "Shop the Collection",
    ctaPath: "/all-products",
  },
  // {
  //   image: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?q=80&w=1170&auto=format&fit=crop",
  //   category: "Women's",
  //   title: "Crafted to Carry More",
  //   cta: "Shop Women's",
  //   ctaPath: "/products/women",
  // },
  // {
  //   image: "https://plus.unsplash.com/premium_photo-1726769202190-ad2a3f2f360b?q=80&w=1170&auto=format&fit=crop",
  //   category: "Men's",
  //   title: "Weekend Ready",
  //   cta: "Shop Men's",
  //   ctaPath: "/products/men",
  // },
  // {
  //   image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1170&auto=format&fit=crop",
  //   category: "Gifting",
  //   title: "The Art of Giving",
  //   cta: "Explore Gifts",
  //   ctaPath: "/products/gifting",
  // },
  // {
  //   image: "https://images.unsplash.com/photo-1586579724969-2cb96841bcb8?q=80&w=1089&auto=format&fit=crop",
  //   category: "Essentials",
  //   title: "Corporate Classics",
  //   cta: "Shop Now",
  //   ctaPath: "/all-products",
  // },
];

const Carousel = () => {
  const hero = slides[0];

  return (
    <section className="relative w-full bg-black">
      <SlideItem slide={hero} textVisible />
    </section>
  );
};

const SlideItem = ({ slide, textVisible }) => {
  return (
    <div className="relative h-[80vh] min-h-[520px] max-h-[820px] overflow-hidden">
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 h-full w-full object-cover object-center scale-[1.03]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />

      <div className="absolute inset-0 flex items-end justify-end pr-14 sm:pr-16 md:pr-20 lg:pr-28 pl-8 sm:pl-10 md:pl-14 lg:pl-18 pb-12 sm:pb-14 md:pb-16 text-right">
        <div
          className={`flex max-w-[640px] flex-col items-end gap-4 transition-all duration-700 ease-out ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h1 className="text-white font-extrabold leading-tight drop-shadow-lg text-4xl sm:text-6xl md:text-[3.6rem] lg:text-[4.2rem]">
            MagFlap™ Travel
          </h1>

          <span className="self-end rounded-sm bg-black/55 px-3 py-1 text-[0.8rem] font-semibold tracking-[0.16em] text-white uppercase shadow-md">
            New Color
          </span>

          <p className="text-white text-2xl sm:text-[2.3rem] md:text-[2.6rem] font-semibold leading-snug drop-shadow-lg">
            For all your travel adventures
          </p>

          <a
            href={slide.ctaPath}
            className="mt-3 inline-flex items-center justify-center rounded-md bg-white px-7 py-3.5 text-base sm:text-lg font-semibold uppercase tracking-wide text-neutral-900 shadow-xl transition-transform duration-200 hover:-translate-y-0.5 hover:bg-neutral-100"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
