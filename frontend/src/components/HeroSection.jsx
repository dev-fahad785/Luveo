import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const springEase = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={reduce ? {} : { scale: videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/wallet-animation.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <motion.div
        className="relative z-[2] min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 text-center"
        style={reduce ? {} : { y: contentY, opacity: contentOpacity }}
      >
        <motion.span
          className="text-[10px] tracking-[0.22em] uppercase font-mono mb-6"
          style={{ color: "rgba(255,255,255,0.5)" }}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: springEase }}
        >
          Luxury Redefined
        </motion.span>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-white max-w-[900px]"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: springEase }}
        >
          Where Elegance Meets Expression
        </motion.h1>

        <motion.p
          className="mt-6 text-sm sm:text-base md:text-lg text-white/60 max-w-[500px] leading-relaxed"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: springEase }}
        >
          Curated fashion for those who refuse to blend in.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: springEase }}
        >
          <HeroCTA />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[var(--prada-off-white)] z-[3]" />

      {!reduce && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-[9px] tracking-[0.22em] uppercase text-white/30 font-mono">Scroll</span>
          <motion.div
            className="w-px h-8 bg-white/20"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </section>
  );
};

const HeroCTA = () => {
  const reduce = useReducedMotion();

  return (
    <Link
      to="/all-products"
      className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[var(--prada-black)] text-xs font-semibold tracking-[0.1em] uppercase overflow-hidden"
    >
      <motion.span
        className="absolute inset-0 bg-[var(--prada-black)]"
        initial={reduce ? false : { x: "-100%" }}
        whileHover={{ x: "0%" }}
        transition={{ duration: 0.4, ease: springEase }}
      />
      <span className="relative z-[1] transition-colors duration-300 group-hover:text-white">
        Explore Collection
      </span>
      <motion.span
        className="relative z-[1] inline-block transition-colors duration-300 group-hover:text-white"
        initial={{ x: -4 }}
        animate={{ x: 0 }}
      >
        &rarr;
      </motion.span>
    </Link>
  );
};

export default HeroSection;
