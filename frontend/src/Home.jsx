import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import { TextScroll } from './components/ScrollText'

const Home = () => {
    return (
        <div style={{ background: "var(--prada-off-white)", minHeight: "100vh" }}>
            <Carousel />
            <TextScroll />
            {/* Editorial Category Section */}
            <Heading heading="Shop Top Collections" subHeading="Proudly Made in Pakistan"/>
            <Explore />
            <div style={{ padding: "20px 0" }} />
            {/* Full Product Grid */}
            <Heading heading="Our 2026's Best Collection" subHeading="" />
            <FeaturedProducts />
        </div>
    )
}

export default Home