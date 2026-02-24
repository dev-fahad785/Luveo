import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "./Alert";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ product, loading }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showGuestSignin, setShowGuestSignin] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user?.id || "");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showAlert = (message, type = "success") => setAlert({ show: true, message, type });
  const hideAlert = () => setAlert(prev => ({ ...prev, show: false }));

  const handleGuestAcct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`);
      const user = res.data?.newUser;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setShowGuestSignin(false);
        window.location.reload();
      }
    } catch (e) {
      showAlert("Error creating guest account", "error");
    }
  };

  const addToCart = async (productId) => {
    if (!userId) { setShowGuestSignin(true); return; }
    setIsAddingToCart(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`, { productId, userId });
      showAlert(res.data.message, "success");
    } catch (e) {
      showAlert(e.response?.data?.message || "Failed to add to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) return <SkeletonCard />;

  return (
    <>
      {alert.show && (
        <AlertMessage message={alert.message} type={alert.type} onClose={hideAlert} duration={4000} showCloseButton />
      )}
      {showGuestSignin && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{ background: "#fff", padding: "32px", maxWidth: 360, width: "90%", textAlign: "center", borderRadius: "16px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Sign in</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--prada-gray)", marginBottom: 24 }}>
              Create a guest account to add items to your cart.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setShowGuestSignin(false)} className="btn-prada-outline" style={{ borderRadius: "8px" }}>Cancel</button>
              <button onClick={handleGuestAcct} className="btn-prada-solid" style={{ borderRadius: "8px" }}>Continue as Guest</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Rounded Card Container ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#f7f7f7",
          borderRadius: "18px",
          padding: "18px 18px 24px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e2e2e2",
          boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.12)" : "0 10px 22px rgba(0,0,0,0.05)",
          transition: "box-shadow  0.28s ease, transform 0.28s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)"
        }}
      >
        {/* Discount badge - Red, rounded, bold top right of the whole card */}
        {product.price > product.discountPrice && (
          <span style={{
            position: "absolute", top: 14, right: 14, zIndex: 10,
            fontFamily: "var(--font-sans)", fontSize: "0.74rem",
            fontWeight: 800, letterSpacing: "0.03em",
            background: "#e53945",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: "999px",
            boxShadow: "0 6px 16px rgba(229,57,69,0.25)"
          }}>
            SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </span>
        )}

        {/* Out of stock overlay */}
        {product.stock <= 0 && (
            <div style={{
                position: "absolute", top: 16, left: 16, zIndex: 10,
                background: "rgba(0,0,0,0.7)", color: "#fff",
                padding: "4px 10px", borderRadius: "6px",
                fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase"
            }}>
                Sold Out
            </div>
        )}

        {/* Image container */}
        <Link to={`/product/${product._id}`} style={{ display: "block", textDecoration: "none", flexGrow: 1 }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1/1",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #ededed"
            }}
          >
            <img
              src={product.img?.[0]}
              alt={product.name}
              loading="lazy"
              style={{
                width: "92%",
                height: "92%",
                objectFit: "contain",
                transition: "transform 0.35s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            />
          </div>
        </Link>

        {/* Info below image */}
        <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Title */}
          <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.08rem",
              fontWeight: 800,
              color: "var(--prada-black)",
              margin: 0,
              lineHeight: 1.16,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {product.name}
            </h3>
          </Link>
          
          {/* Color Swatches */}
          <div style={{ display: "flex", gap: "6px" }}>
            {product.colors && product.colors.length > 0 ? (
              product.colors.slice(0, 6).map((color, idx) => (
                <span
                  key={`${color.hex}-${idx}`}
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    background: color.hex,
                    border: "2px solid #fff",
                    outline: "1px solid #d0d0d0",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.06)"
                  }}
                />
              ))
            ) : (
              <>
                <span style={{ width: "15px", height: "15px", borderRadius: "50%", background: "#a5673f", border: "2px solid #fff", outline: "1px solid #cfcfcf" }} />
                <span style={{ width: "15px", height: "15px", borderRadius: "50%", background: "#2f4a5f", border: "2px solid #fff", outline: "1px solid #cfcfcf" }} />
                <span style={{ width: "15px", height: "15px", borderRadius: "50%", background: "#0f0f0f", border: "2px solid #fff", outline: "1px solid #cfcfcf" }} />
                <span style={{ width: "15px", height: "15px", borderRadius: "50%", background: "#0d5c45", border: "2px solid #fff", outline: "1px solid #cfcfcf" }} />
              </>
            )}
          </div>

          {/* Pricing */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
            {product.price > product.discountPrice && (
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "#9c9c9c",
                textDecoration: "line-through",
              }}>
                Rs.{product.price?.toLocaleString()}
              </span>
            )}
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.08rem",
              fontWeight: 900,
              color: "#0f0f0f",
            }}>
              Rs.{product.discountPrice?.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Hover Quick Add to Cart Button */}
        <AnimatePresence>
            {hovered && product.stock > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}
                >
                    <button
                        onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                        disabled={isAddingToCart}
                        style={{
                            width: "100%", padding: "12px", borderRadius: "8px",
                            background: "var(--prada-black)", color: "#fff",
                            fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 700,
                            border: "none", cursor: "pointer",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
                        }}
                    >
                        {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </>
  );
};

const SkeletonCard = () => (
   <div style={{ 
       background: "var(--prada-off-white)", 
       borderRadius: "16px", 
       padding: "16px",
       height: "360px",
       display: "flex", flexDirection: "column"
   }}>
    <div style={{
      width: "100%", flexGrow: 1,
      background: "var(--prada-light-gray)",
      borderRadius: "8px",
      animation: "pulse 1.8s ease-in-out infinite",
      marginBottom: "16px"
    }} />
    <div style={{ height: 20, width: "70%", background: "var(--prada-light-gray)", marginBottom: 12, borderRadius: "4px", animation: "pulse 1.8s ease-in-out infinite" }} />
    <div style={{ height: 16, width: "30%", background: "var(--prada-light-gray)", borderRadius: "4px", animation: "pulse 1.8s ease-in-out infinite" }} />
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
  </div>
);

export default ProductCard;