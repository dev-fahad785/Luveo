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
        className={`relative flex flex-col bg-[#f7f7f7] rounded-[18px] px-[18px] pb-6 pt-[18px] border border-[#e2e2e2] transition-all duration-300 ease-out ${
          hovered
            ? "shadow-[0_16px_40px_rgba(0,0,0,0.12)] -translate-y-1"
            : "shadow-[0_10px_22px_rgba(0,0,0,0.05)] translate-y-0"
        }`}
      >
        {/* Discount badge - Red, rounded, bold top right of the whole card */}
        {product.price > product.discountPrice && (
          <span
            className="absolute top-[14px] right-[14px] z-10 font-sans text-[0.74rem] font-extrabold tracking-[0.03em] bg-[#e53945] text-white px-3 py-1 rounded-full shadow-[0_6px_16px_rgba(229,57,69,0.25)]"
          >
            SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </span>
        )}

        {/* Out of stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-2.5 py-1 rounded-md font-sans text-[0.75rem] font-bold tracking-[0.05em] uppercase">
            Sold Out
          </div>
        )}

        {/* Image container */}
        <Link to={`/product/${product._id}`} className="block no-underline flex-grow">
          <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center bg-white rounded-[14px] border border-[#ededed]">
            <img
              src={product.img?.[0]}
              alt={product.name}
              loading="lazy"
              className={`w-[92%] h-[92%] object-contain transition-transform duration-300 ease-out ${hovered ? "scale-[1.06]" : "scale-100"}`}
            />
          </div>
        </Link>

        {/* Info below image */}
        <div className="pt-4 flex flex-col gap-[10px]">
          
          {/* Title */}
          <Link to={`/product/${product._id}`} className="no-underline text-inherit">
            <h3 className="font-heading text-[1.08rem] font-extrabold text-[#0f0f0f] leading-[1.16] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {product.name}
            </h3>
          </Link>
          
          {/* Color Swatches */}
          <div className="flex gap-[6px]">
            {product.colors && product.colors.length > 0 ? (
              product.colors.slice(0, 6).map((color, idx) => (
                <span
                  key={`${color.hex}-${idx}`}
                  className="w-[15px] h-[15px] rounded-full border-2 border-white outline outline-1 outline-[#d0d0d0] shadow-[0_2px_5px_rgba(0,0,0,0.06)]"
                  style={{ background: color.hex }}
                />
              ))
            ) : (
              <>
                <span className="w-[15px] h-[15px] rounded-full border-2 border-white outline outline-1 outline-[#cfcfcf] shadow-[0_2px_5px_rgba(0,0,0,0.06)]" style={{ background: "#a5673f" }} />
                <span className="w-[15px] h-[15px] rounded-full border-2 border-white outline outline-1 outline-[#cfcfcf] shadow-[0_2px_5px_rgba(0,0,0,0.06)]" style={{ background: "#2f4a5f" }} />
                <span className="w-[15px] h-[15px] rounded-full border-2 border-white outline outline-1 outline-[#cfcfcf] shadow-[0_2px_5px_rgba(0,0,0,0.06)]" style={{ background: "#0f0f0f" }} />
                <span className="w-[15px] h-[15px] rounded-full border-2 border-white outline outline-1 outline-[#cfcfcf] shadow-[0_2px_5px_rgba(0,0,0,0.06)]" style={{ background: "#0d5c45" }} />
              </>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-[2px]">
            {product.price > product.discountPrice && (
              <span className="font-sans text-[0.92rem] font-bold text-[#9c9c9c] line-through">
                Rs.{product.price?.toLocaleString()}
              </span>
            )}
            <span className="font-sans text-[1.08rem] font-black text-[#0f0f0f]">
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
                    className="absolute bottom-4 left-4 right-4"
                >
                    <button
                        onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                        disabled={isAddingToCart}
                        className="w-full py-3 rounded-lg bg-[#0f0f0f] text-white font-sans text-[0.9rem] font-bold shadow-[0_6px_16px_rgba(0,0,0,0.15)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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