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
            <Heading heading="Explore" subHeading="Shop by category"/>
            <Explore />
            <div style={{ padding: "20px 0" }} />
            {/* Full Product Grid */}
            <Heading heading="The Collection" subHeading="All products" />
            <FeaturedProducts />
        </div>
    )
}

export default Home