import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaExpand, FaCheck, FaAngleUp, FaAngleDown } from 'react-icons/fa';

import Reviews from "./random/Reviews";
import AlertMessage from "./Alert";

const ProductDisplay = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFullScreenImage, setIsFullScreenImage] = useState(false);
    
    // Status states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    
    // Image gallery state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); 
    const [showGuestSign, setShowGuestSignin] = useState(false);
    
    // Alert state
    const [alertProps, setAlertProps] = useState({ message: "", type: "success", visible: false });

    // Initialize user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserId(user?.id || "");
            } catch (e) { console.error(e); }
        }
    }, []);

    // Fetch product
    const getProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-product/${id}`);
            const productData = response.data.product;
            setProduct(productData);
            if(productData.colors?.length > 0) setSelectedColor(productData.colors[0].hex);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to load product data");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { if (id) getProduct(); }, [id, getProduct]);

    // Helpers
    const showNotification = (message, type = "success") => setAlertProps({ message, type, visible: true });
    const handleCloseAlert = () => setAlertProps(prev => ({ ...prev, visible: false }));

    const handleGuestAcct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
            const user = response.data?.newUser;
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                setShowGuestSignin(false);
                setLoading(false);
                window.location.reload();
            }
        } catch (error) { console.error(error); setLoading(false); }
    };

    const addToCart = async (productId, buyNow = false) => {
        if (!userId) { setShowGuestSignin(true); return; }
        if (buyNow) setIsBuyingNow(true); else setIsAddingToCart(true);

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`, { productId, userId });
            showNotification(
                buyNow ? "Product purchased successfully! Redirecting..." : "Added to cart successfully!",
                "success"
            );
            setTimeout(() => window.location.href = buyNow ? '/checkout' : '/profile', 1500);
        } catch (error) {
            showNotification(error.response?.data?.message || "Error adding to cart", "error");
        } finally {
            setIsAddingToCart(false); setIsBuyingNow(false);
        }
    };

    const handlePrevImage = () => {
       setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.img.length - 1);
    };

    const handleNextImage = () => {
       setSelectedImageIndex(prev => prev < product.img.length - 1 ? prev + 1 : 0);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center p-8"><div className="w-12 h-12 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-sans tracking-widest uppercase">{error}</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-sans tracking-widest uppercase text-gray-500">Product not found</div>;

    const discountPercentage = Math.round(((product.price - product.discountPrice) / product.price) * 100);

    return (
        <div style={{ background: "var(--prada-off-white)", minHeight: "100vh", paddingBottom: "80px" }}>
            
            {/* Alerts & Modals */}
            {alertProps.visible && (
                <AlertMessage message={alertProps.message} type={alertProps.type} onClose={handleCloseAlert} duration={4000} showCloseButton />
            )}
            
            {showGuestSign && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
                    <div style={{ background: "#fff", padding: "32px", maxWidth: 360, width: "90%", textAlign: "center", borderRadius: "var(--radius-md)" }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Sign in</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--prada-gray)", marginBottom: 24 }}>
                            Create a guest account to continue checkout.
                        </p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={() => setShowGuestSignin(false)} className="btn-prada-outline">Cancel</button>
                            <button onClick={handleGuestAcct} className="btn-prada-solid">Continue as Guest</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Product Layout */}
            <div style={{ 
                maxWidth: 1440, 
                margin: "0 auto", 
                padding: "40px clamp(20px, 4vw, 60px)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
                gap: "clamp(40px, 6vw, 100px)",
                alignItems: "start"
            }} className="md:grid-cols-[1.3fr_1fr] grid-cols-1">
                
                {/* ── Left Column: Media Gallery ── */}
                <div style={{ display: "flex", gap: "24px", height: "calc(100vh - 120px)", position: "sticky", top: "100px" }}>
                    
                    {/* Vertical Thumbnails */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "80px", flexShrink: 0 }}>
                        <button onClick={handlePrevImage} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 0", color: "var(--prada-black)", opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
                            <FaAngleUp size={24} />
                        </button>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflowY: "auto", scrollbarWidth: "none" }} className="hide-scrollbar">
                           {product.img.map((img, idx) => (
                               <button 
                                  key={idx}
                                  onClick={() => setSelectedImageIndex(idx)}
                                  style={{
                                      width: "100%", aspectRatio: "1/1",
                                      background: "var(--prada-white)",
                                      border: selectedImageIndex === idx ? "2px solid var(--prada-black)" : "1px solid var(--prada-border)",
                                      padding: "8px",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease"
                                  }}
                                  className={selectedImageIndex !== idx ? "hover:border-gray-400" : ""}
                               >
                                   <img src={img} alt={`Thumbnail ${idx}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                               </button>
                           ))}
                        </div>

                        <button onClick={handleNextImage} style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 0", color: "var(--prada-black)", opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
                            <FaAngleDown size={24} />
                        </button>
                    </div>

                    {/* Main Stage */}
                    <div style={{ 
                        flex: 1, 
                        background: "var(--prada-white)", 
                        borderRadius: "16px",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
                        border: "1px solid rgba(0,0,0,0.03)"
                    }}>
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImageIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                src={product.img[selectedImageIndex]}
                                alt={product.name}
                                style={{
                                    width: "100%", height: "100%", objectFit: "contain",
                                    maxHeight: "75vh"
                                }}
                            />
                        </AnimatePresence>
                        
                        <button
                            onClick={() => setIsFullScreenImage(true)}
                            style={{
                                position: "absolute", top: 16, right: 16,
                                background: "var(--prada-white)", border: "1px solid var(--prada-border)",
                                padding: "12px", borderRadius: "50%", cursor: "pointer",
                                color: "var(--prada-black)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                            }}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <FaExpand />
                        </button>
                    </div>
                </div>


                {/* ── Right Column: Sticky Product Info ── */}
                <div style={{ paddingTop: "20px" }}>
                    <div style={{
                        background: "var(--prada-white)",
                        borderRadius: "16px",
                        padding: "clamp(24px, 4vw, 40px)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                        position: "relative"
                    }}>
                        
                        {/* SALE Badge */}
                        {product.price > product.discountPrice && (
                            <div style={{
                                position: "absolute", top: -12, right: 32,
                                background: "var(--brand-accent)", color: "#fff",
                                padding: "6px 14px", borderRadius: "20px",
                                fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em"
                            }}>
                                SALE
                            </div>
                        )}

                        {/* Reviews summary */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                            <div style={{ display: "flex", gap: "2px", color: "#000" }}>
                                {Array(5).fill(0).map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--prada-gray)", textDecoration: "underline", cursor:"pointer" }}>
                                30 Reviews
                            </span>
                        </div>

                        {/* Title & Tagline */}
                        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--prada-black)", margin: "0 0 8px", lineHeight: 1.1 }}>
                            {product.name}
                        </h1>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: "var(--prada-gray)", margin: "0 0 24px" }}>
                            {product.tagline}
                        </p>

                        {/* Price */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px" }}>
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: "2rem", fontWeight: 800, color: "var(--prada-black)" }}>
                                Rs.{product.discountPrice?.toLocaleString()}
                            </span>
                            {product.price > product.discountPrice && (
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: "1.2rem", fontWeight: 600, color: "#BDBDBD", textDecoration: "line-through" }}>
                                    Rs.{product.price?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Color Selector */}
                        {product.colors?.length > 0 && (
                            <div style={{ marginBottom: "32px" }}>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "12px", color: "var(--prada-black)" }}>
                                    Color: <span style={{ fontWeight: 400, color: "var(--prada-gray)" }}>{product.colors.find(c => c.hex === selectedColor)?.name}</span>
                                </p>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {product.colors.map(color => (
                                        <button
                                            key={color._id}
                                            onClick={() => setSelectedColor(color.hex)}
                                            style={{
                                                width: "36px", height: "36px", borderRadius: "50%",
                                                background: color.hex, cursor: "pointer",
                                                border: "2px solid #fff",
                                                outline: selectedColor === color.hex ? "2px solid var(--prada-black)" : "1px solid var(--prada-border)",
                                                transition: "all 0.2s"
                                            }}
                                            className={selectedColor !== color.hex ? "hover:outline-gray-400" : ""}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fake Stock Indicator (Matches Waldor styling) */}
                        <div style={{ marginBottom: "32px" }}>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 700, fontStyle: "italic", color: "var(--brand-accent)", marginBottom: "8px" }}>
                                {product.stock > 0 ? `${Math.min(product.stock, 18)} in stock` : "Out of stock"}
                            </p>
                            <div style={{ height: "4px", background: "#E0E0E0", width: "100%", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{ height: "100%", background: "#4CAF50", width: product.stock > 0 ? "70%" : "0%" }} />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                            <button
                                onClick={() => addToCart(product._id, false)}
                                disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
                                style={{
                                    width: "100%", padding: "18px", borderRadius: "8px",
                                    background: "var(--prada-black)", color: "#fff",
                                    fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 700,
                                    border: "none", cursor: "pointer", transition: "all 0.2s",
                                    opacity: (isAddingToCart || product.stock <= 0) ? 0.7 : 1
                                }}
                                className="hover:bg-gray-800"
                            >
                                {isAddingToCart ? "Adding..." : "Add To Cart"}
                            </button>
                            
                            <button
                                onClick={() => addToCart(product._id, true)}
                                disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
                                style={{
                                    width: "100%", padding: "18px", borderRadius: "8px",
                                    background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)", color: "var(--prada-black)",
                                    fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 700,
                                    border: "1px solid #d4d4d4", cursor: "pointer", transition: "all 0.2s",
                                    opacity: (isBuyingNow || product.stock <= 0) ? 0.7 : 1
                                }}
                                className="hover:bg-gray-300"
                            >
                                {isBuyingNow ? "Processing..." : "Buy It Now"}
                            </button>
                        </div>
                        
                        {/* Features / Pitch */}
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--prada-black)", lineHeight: 1.6, marginBottom: "24px" }}>
                            The simplicity paradox — do less, deliver more. {product.tagline} Perfects the user flow and integrates seamlessly into your daily carry.
                        </p>
                        
                        <a href="#product-details" style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--prada-black)", textDecoration: "underline", fontWeight: 600 }}>
                            Show More
                        </a>
                    </div>
                </div>
            </div>

            <div id="product-details" style={{ padding: "40px 0" }} />

            {/* Bottom Content Area */}
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
                
                {/* Product Overview & Specs Accordion style */}
                <div style={{ background: "var(--prada-white)", borderRadius: "16px", padding: "40px", marginBottom: "60px", border: "1px solid var(--prada-border)" }}>
                     <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "24px", color: "var(--prada-black)" }}>Features & Specs</h2>
                     <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", lineHeight: 1.6, color: "var(--prada-gray)", marginBottom: "32px" }}>
                         {product.description}
                     </p>
                     
                     {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 && (
                         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", borderTop: "1px solid var(--prada-border)", paddingTop: "32px" }}>
                             {Object.entries(product.technicalSpecs).map(([key, value]) => (
                                 <div key={key}>
                                     <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 700, color: "var(--prada-black)", textTransform: "capitalize", marginBottom: "4px" }}>
                                         {key.replace(/([A-Z])/g, ' $1')}
                                     </p>
                                     <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "var(--prada-gray)" }}>
                                         {value}
                                     </p>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>

                {/* Reviews Section */}
                <Reviews selectedProduct={product.name}/>
            </div>

            {/* Full Screen Image Modal */}
            {isFullScreenImage && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.98)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                    <button
                        style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "var(--prada-black)" }}
                        onClick={() => setIsFullScreenImage(false)}
                    >
                        ×
                    </button>
                    <img
                        src={product.img[selectedImageIndex]}
                        alt={product.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductDisplay;