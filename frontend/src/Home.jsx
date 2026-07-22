import Explore from './components/Explore'
import FeaturedProducts from './components/FeaturedProducts'
import ExploreWithUs from './components/ExploreWithUs'
import RestockShowcase from './components/RestockShowcase'
import HeroSection from './components/HeroSection'
import InfoBanner from './components/Features'

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="text-center mb-14">
    {eyebrow && (
      <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-[var(--prada-mid-gray)]">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--prada-black)] mt-3">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm text-[var(--prada-mid-gray)] mt-2">
        {subtitle}
      </p>
    )}
  </div>
);

const Home = () => {
  return (
    <div>
      <HeroSection />
      <InfoBanner />

      <section className="bg-[var(--prada-off-white)]">
        <SectionHeading eyebrow="Categories" title="Shop Top Collections" subtitle="Proudly Made in Pakistan" />
        <Explore />
      </section>

      <section className="bg-[var(--prada-off-white)]">
        <SectionHeading eyebrow="Featured" title="Our 2026's Best Collection" />
        <FeaturedProducts />
      </section>

      <ExploreWithUs />

      <section className="bg-[var(--prada-off-white)]">
        <SectionHeading eyebrow="Coming Soon" title="Our Restock Showcase" />
        <RestockShowcase />
      </section>
    </div>
  )
}

export default Home
