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

  const primaryImage = product?.img?.[0];
  const secondaryImage = product?.img?.[1];

  if (loading) return <SkeletonCard />;

  return (
    <>
      {alert.show && (
        <AlertMessage message={alert.message} type={alert.type} onClose={hideAlert} duration={4000} showCloseButton />
      )}
      {showGuestSignin && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center">
          <div className="bg-white px-8 py-8 max-w-[360px] w-[90%] text-center rounded-2xl shadow-lg">
            <p className="font-sans text-[1.3rem] font-bold mb-2">Sign in</p>
            <p className="font-sans text-sm text-[#6c6c6c] mb-6">Create a guest account to add items to your cart.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowGuestSignin(false)}
                className="rounded-lg border border-[#0f0f0f] px-4 py-2 font-sans text-sm font-semibold text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGuestAcct}
                className="rounded-lg bg-[#0f0f0f] px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-[#1a1a1a] transition"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Rounded Card Container ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex w-full max-w-[360px] flex-col bg-[#ededed] rounded-[26px] px-6 py-6 border border-[#d8d8d8] transition-all duration-300 ease-out ${
          hovered ? "shadow-[0_22px_60px_rgba(0,0,0,0.16)] scale-[1.015]" : "shadow-[0_16px_44px_rgba(0,0,0,0.12)]"
        }`}
        style={{ minWidth: "340px" }}
      >
        {/* Discount badge */}
        {product.price > product.discountPrice && (
          <span className="absolute top-4 right-4 z-10 text-[0.7rem] font-semibold uppercase tracking-[0.05em] bg-[#ff2d55] text-white px-3 py-1 rounded-full shadow-[0_8px_18px_rgba(255,45,85,0.25)]">
            SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </span>
        )}

        {/* Out of stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-2.5 py-1 rounded-md text-[0.75rem] font-semibold tracking-[0.05em] uppercase">
            Sold Out
          </div>
        )}

        {/* Image container */}
        <Link to={`/product/${product._id}`} className="block no-underline flex-grow">
          <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center bg-[#f5f5f5] rounded-[18px] p-0">
            <img
              src={hovered && secondaryImage ? secondaryImage : primaryImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-opacity duration-300 ease-out drop-shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            />
          </div>
        </Link>

        {/* Info below image */}
        <div className="pt-5 flex flex-col gap-4">
          {/* Title */}
          <Link to={`/product/${product._id}`} className="no-underline text-inherit">
            <h3 className="text-2xl font-extrabold text-[#111111] tracking-tight leading-[1.15] m-0">
              {product.name || "ATOM-X Pro"}
            </h3>
          </Link>

          {/* Color Swatches */}
          <div className="flex items-center gap-2">
            {(product.colors && product.colors.length > 0 ? product.colors.slice(0, 5) : [
              { hex: "#e8ddcf" },
              { hex: "#7c6ad6" },
              { hex: "#9c6b4f" },
              { hex: "#3d7f5f" },
              { hex: "#0f0f0f" },
            ]).map((color, idx) => (
              <span
                key={`${color.hex}-${idx}`}
                className={`w-[20px] h-[20px] rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.08)] outline outline-1 outline-[#d7d7d7] ${
                  idx === 0 ? "ring-2 ring-offset-2 ring-[#0f0f0f] ring-offset-[#ededed]" : ""
                }`}
                style={{ background: color.hex }}
              />
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            {product.price > product.discountPrice && (
              <span className="text-base font-medium text-[#b0b0b0] line-through">
                Rs.{product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-xl font-bold text-[#0b0b0b]">
              Rs.{product.discountPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
              className="absolute bottom-5 left-6 right-6"
            >
              <button
                onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                disabled={isAddingToCart}
                className="w-full py-3 rounded-xl bg-[#111111] text-white text-[0.95rem] font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.15)] transition hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)] disabled:opacity-70 disabled:cursor-not-allowed"
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
  <div className="bg-[#f7f7f7] rounded-2xl p-4 h-[360px] flex flex-col animate-pulse">
    <div className="w-full flex-1 bg-[#e5e5e5] rounded-lg mb-4" />
    <div className="h-5 w-[70%] bg-[#e5e5e5] mb-3 rounded" />
    <div className="h-4 w-[30%] bg-[#e5e5e5] rounded" />
  </div>
);

export default ProductCard;