

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CrownIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path
            fill="currentColor"
            d="M4 7.5 8 12l3-6 3 6 4-4.5L19.5 17h-15z"
        />
    </svg>
);

const TruckIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path
            fill="currentColor"
            d="M3 6h10v5h5l2 3v4h-1.5a2.5 2.5 0 0 1-5 0H9.5a2.5 2.5 0 0 1-5 0H3z"
        />
    </svg>
);

const GiftIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path
            fill="currentColor"
            d="M4 8h16v12H4zm8-6a2.5 2.5 0 0 1 2.5 2.5c0 1.5-2.5 3.5-2.5 3.5s-2.5-2-2.5-3.5A2.5 2.5 0 0 1 12 2m-7 6h14v3H5z"
        />
    </svg>
);

const heroFeatures = [
    { label: "28,000+ Loyal Customers", icon: CrownIcon },
    { label: "Fast Shipping", icon: TruckIcon },
    { label: "Complimentary Gift Packing", icon: GiftIcon },
];

const slides = [
    {
        // image: "/images/carousel/banner-4.jpeg",
        image: "https://images.unsplash.com/photo-1531190260877-c8d11eb5afaf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Pay at Checkout",
        subtitle: "With Card or Bank Transfer",
        badge: "& Get 5% OFF",
        code: "CARD5",
    },
    {
        // image: "/images/carousel/banner-1.jpeg",
        image: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Everyday Essentials",
        subtitle: "Crafted to carry more with ease",
        badge: "New Arrivals",
        code: "DISCOVER",
    },
    {
        // image: "/images/carousel/banner-8.jpeg",
        image: "https://plus.unsplash.com/premium_photo-1726769202190-ad2a3f2f360b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Weekend Ready",
        subtitle: "Tough builds, soft touch finishes",
        badge: "Limited Drop",
        code: "WEEKEND",
    },
    {
        // image: "/images/carousel/banner-3.jpeg",
        image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Corporate Classics",
        subtitle: "Polished silhouettes for workdays",
        badge: "Editor’s Pick",
        code: "OFFICE",
    },
    {
        // image: "/images/carousel/banner-3.jpeg",
        image: "https://images.unsplash.com/photo-1586579724969-2cb96841bcb8?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Corporate Classics",
        subtitle: "Polished silhouettes for workdays",
        badge: "Editor’s Pick",
        code: "OFFICE",
    },
];

const ImageCarouselWithStaticBanner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 5900,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 1800,
        fade: true,
        cssEase: "linear",
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <section className="bg-white w-full">
            <div className="hidden md:grid grid-cols-3 items-center text-center text-[10px] lg:text-xs tracking-[0.24em] uppercase text-gray-700 border-y border-gray-200 py-4 gap-4 w-full">
                {heroFeatures.map((item) => (
                    <div key={item.label} className="flex items-center justify-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="relative w-full">
                <div className="relative overflow-hidden rounded-none shadow-sm">
                    <Slider {...settings} className="hero-carousel">
                        {slides.map((slide) => (
                            <div key={slide.image} className="relative">
                                <div className="h-[480px] sm:h-[560px] lg:h-[680px]">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
                                            <div className="flex justify-start">
                                                <div className="max-w-xl w-full space-y-4 sm:space-y-5 text-white drop-shadow-xl text-left bg-black/35 backdrop-blur-[1px] border border-white/10 rounded-sm px-5 sm:px-7 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="h-px w-8 bg-white/70" />
                                                        <span className="text-[11px] tracking-[0.28em] uppercase text-white/75">Offer</span>
                                                    </div>
                                                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                                                        {slide.title}
                                                    </h2>
                                                    <p className="text-lg sm:text-xl text-white/90">{slide.subtitle}</p>

                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-white text-gray-900 text-sm font-semibold uppercase tracking-[0.14em] px-4 py-2 rounded-sm shadow-md">
                                                            {slide.badge}
                                                        </span>
                                                        <span className="text-xl sm:text-2xl font-semibold text-white/90">
                                                            Promo Code: <span className="tracking-widest text-white">{slide.code}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button className="inline-flex items-center gap-3 bg-white text-gray-900 text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5">
                                                            Shop Now
                                                            <span className="text-lg">→</span>
                                                        </button>
                                                        <span className="text-sm text-white/75">Limited time only</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default ImageCarouselWithStaticBanner;
