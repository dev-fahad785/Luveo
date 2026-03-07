const ExploreWithUs = () => {
  return (
    <section className="px-4 pb-16" aria-labelledby="explore-with-us-title">
      <div
        className="relative mx-auto flex max-w-[84rem] flex-col justify-center overflow-hidden rounded-[24px] bg-gray-900 text-white shadow-lg"
        style={{
          backgroundImage:
            "url('https://www.waldorleather.com/cdn/shop/files/bbbb.png?v=1740510679')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "360px",
        }}
      >
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-4 px-6 py-12 sm:px-10 md:px-14 lg:px-16">
          <h2
            id="explore-with-us-title"
            className="text-3xl font-bold leading-tight drop-shadow md:text-4xl lg:text-[44px]"
          >
            Explore With Us
          </h2>

          <ul className="flex list-disc flex-col gap-2 pl-5 text-lg font-medium drop-shadow">
            <li>Product Drops</li>
            <li>Limited Editions</li>
            <li>Blog Posts</li>
            <li>News & Announcements</li>
          </ul>

          <form className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="explore-email">
              Email address
            </label>
            <input
              id="explore-email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-[12px] border border-white/30 bg-white/90 px-4 py-3 text-[17px] font-medium text-neutral-900 shadow-sm outline-none backdrop-blur focus:border-white focus:ring-2 focus:ring-white/70"
            />
            <button
              type="submit"
              className="min-w-[120px] rounded-[12px] bg-gray-900 px-5 py-3 text-[17px] font-semibold text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/70"
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
