import Carousel from './components/Carousel'
import Explore from './components/Explore'
import Heading from './components/Heading'
import FeaturedProducts from './components/FeaturedProducts'
import { TextScroll } from './components/ScrollText'

const Home = () => {
    return (
        <>
            <Carousel />
            <TextScroll />

            {/* Editorial Category Section */}
            <Heading
                heading="Explore"
                subHeading="Shop by category"
            />
            <Explore />

            {/* Thin divider */}
            <div style={{ borderTop: "1px solid var(--prada-border)", margin: "0 clamp(20px,5vw,80px)" }} />

            {/* Full Product Grid */}
            <Heading
                heading="The Collection"
                subHeading="All products"
            />
            <FeaturedProducts />
        </>
    )
}

export default Home