import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "./Alert";

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
          <div style={{ background: "#fff", padding: "32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: 8 }}>Sign in to continue</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--prada-gray)", marginBottom: 24, letterSpacing: "0.05em" }}>
              Create a guest account to add items to your cart.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setShowGuestSignin(false)} className="btn-prada-outline">Cancel</button>
              <button onClick={handleGuestAcct} className="btn-prada-solid">Continue as Guest</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Card ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer", background: "var(--prada-white)" }}
      >
        {/* Image container */}
        <Link to={`/product/${product._id}`} style={{ display: "block", textDecoration: "none" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3/4",
              overflow: "hidden",
              background: "var(--prada-off-white)",
            }}
          >
            <img
              src={product.img?.[0]}
              alt={product.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* Discount badge */}
            {product.price > product.discountPrice && (
              <span style={{
                position: "absolute", top: 12, left: 12,
                fontFamily: "var(--font-sans)", fontSize: "0.58rem",
                letterSpacing: "0.14em", fontWeight: 500,
                background: "var(--prada-black)", color: "#fff",
                padding: "3px 8px",
              }}>
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}

            {/* Low stock */}
            {product.stock <= 5 && product.stock > 0 && (
              <span style={{
                position: "absolute", bottom: 12, left: 12,
                fontFamily: "var(--font-sans)", fontSize: "0.55rem",
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "var(--prada-gray)",
              }}>
                Only {product.stock} left
              </span>
            )}

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                  Out of Stock
                </span>
              </div>
            )}

            {/* Hover Add to Cart */}
            {product.stock > 0 && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "14px 16px",
                background: "rgba(255,255,255,0.85)",
                transform: hovered ? "translateY(0)" : "translateY(100%)",
                transition: "transform 0.35s ease",
              }}>
                <button
                  onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                  disabled={isAddingToCart}
                  style={{
                    display: "block",
                    width: "100%",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--prada-black)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    opacity: isAddingToCart ? 0.5 : 1,
                  }}
                >
                  {isAddingToCart ? "Adding…" : "Add to Cart"}
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* Info below image */}
        <div style={{ padding: "12px 0 20px" }}>
          {product.category && (
            <p className="text-luxury-label" style={{ marginBottom: 5 }}>{product.category}</p>
          )}
          <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <h3 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              fontWeight: 400,
              letterSpacing: "0.04em",
              color: "var(--prada-black)",
              margin: "0 0 6px",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {product.name}
            </h3>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              fontWeight: 400,
              letterSpacing: "0.04em",
              color: "var(--prada-black)",
            }}>
              PKR {product.discountPrice?.toLocaleString()}
            </span>
            {product.price > product.discountPrice && (
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                color: "var(--prada-mid-gray)",
                textDecoration: "line-through",
                letterSpacing: "0.02em",
              }}>
                PKR {product.price?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const SkeletonCard = () => (
  <div style={{ background: "var(--prada-white)" }}>
    <div style={{
      width: "100%", aspectRatio: "3/4",
      background: "var(--prada-light-gray)",
      animation: "pulse 1.8s ease-in-out infinite",
    }} />
    <div style={{ padding: "12px 0 20px" }}>
      <div style={{ height: 8, width: "40%", background: "var(--prada-light-gray)", marginBottom: 10, animation: "pulse 1.8s ease-in-out infinite" }} />
      <div style={{ height: 10, width: "85%", background: "var(--prada-light-gray)", marginBottom: 6, animation: "pulse 1.8s ease-in-out infinite" }} />
      <div style={{ height: 10, width: "55%", background: "var(--prada-light-gray)", animation: "pulse 1.8s ease-in-out infinite" }} />
    </div>
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
  </div>
);

export default ProductCard;