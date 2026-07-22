const ExploreWithUs = () => {
  return (
    <section className="bg-[var(--prada-black)]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-white/40">
            Stay Connected
          </span>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 leading-tight">
            Explore With Us
          </h2>

          <p className="text-sm md:text-base text-white/50 mt-4 max-w-md leading-relaxed">
            Product drops, limited editions, blog posts, and news — delivered to your inbox.
          </p>

          <form className="mt-8 flex w-full max-w-md gap-3">
            <label className="sr-only" htmlFor="explore-email">Email address</label>
            <input
              id="explore-email"
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-white/50 transition-colors placeholder:text-white/30"
            />
            <button
              type="submit"
              className="bg-white text-[var(--prada-black)] px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ExploreWithUs;
