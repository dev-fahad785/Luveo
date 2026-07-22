import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaExpand, FaAngleUp, FaAngleDown, FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa";

import Reviews from "./random/Reviews";
import AlertMessage from "./Alert";
import { setColorSelection } from "../store/cartSlice";

const springEase = [0.16, 1, 0.3, 1];

const ProductDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [alertProps, setAlertProps] = useState({ message: "", type: "success", visible: false });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user?.id || user?._id || "");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/product/get-product/" + id
      );
      const productData = response.data.product;
      setProduct(productData);
      if (productData.colors?.length > 0)
        setSelectedColor(productData.colors[0].hex);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) getProduct();
  }, [id, getProduct]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColor]);

  const showNotification = (message, type = "success") =>
    setAlertProps({ message, type, visible: true });
  const handleCloseAlert = () =>
    setAlertProps((prev) => ({ ...prev, visible: false }));

  const ensureUserId = async () => {
    if (userId) return userId;
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/user/guest-signup"
      );
      const user = response.data?.newUser;
      const uid = user?.id || user?._id;
      if (!uid) throw new Error("Unable to create guest account");
      localStorage.setItem("user", JSON.stringify(user));
      setUserId(uid);
      return uid;
    } catch (error) {
      showNotification("Error creating guest account", "error");
      throw error;
    }
  };

  const addToCart = async (productId, buyNow = false) => {
    if (buyNow) setIsBuyingNow(true);
    else setIsAddingToCart(true);
    try {
      const ensuredUserId = await ensureUserId();
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/product/add-to-cart",
        { productId, userId: ensuredUserId }
      );
      const selectedColorObj = product.colors?.find(
        (c) => c.hex === selectedColor
      );
      if (selectedColorObj) {
        dispatch(
          setColorSelection({
            productId,
            color: { name: selectedColorObj.name, hex: selectedColorObj.hex },
          })
        );
      }
      showNotification(
        buyNow
          ? "Product purchased successfully! Redirecting..."
          : "Added to cart successfully!",
        "success"
      );
      navigate(buyNow ? "/checkout" : "/profile");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error adding to cart",
        "error"
      );
    } finally {
      setIsAddingToCart(false);
      setIsBuyingNow(false);
    }
  };

  const currentImages =
    product?.colors?.find((c) => c.hex === selectedColor)?.images || [];

  const handlePrevImage = () =>
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : currentImages.length - 1
    );
  const handleNextImage = () =>
    setSelectedImageIndex((prev) =>
      prev < currentImages.length - 1 ? prev + 1 : 0
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--prada-off-white)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border border-[var(--prada-black)] border-t-transparent animate-spin" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[var(--prada-mid-gray)]">
            Loading
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--prada-off-white)]">
        <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[var(--brand-accent)]">
          {error}
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--prada-off-white)]">
        <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[var(--prada-mid-gray)]">
          Product not found
        </p>
      </div>
    );

  const discountPercentage = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  return (
    <div className="bg-[var(--prada-off-white)] min-h-screen pt-28 md:pt-36 pb-20">
      {alertProps.visible && (
        <AlertMessage
          message={alertProps.message}
          type={alertProps.type}
          onClose={handleCloseAlert}
          duration={4000}
          showCloseButton
        />
      )}

      <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,60px)]">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-[clamp(32px,5vw,80px)] items-start">
          {/* ── Left: Media Gallery ── */}
          <div>
            {/* Mobile layout */}
            <div className="md:hidden">
              <div className="relative bg-white overflow-hidden flex items-center justify-center p-6 aspect-square border border-[var(--prada-border)]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedColor + "-" + selectedImageIndex}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: springEase }}
                    src={currentImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>

                {currentImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border border-[var(--prada-border)] p-2.5 text-[var(--prada-black)] active:scale-95 transition"
                    >
                      <FaAngleLeft size={14} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-[var(--prada-border)] p-2.5 text-[var(--prada-black)] active:scale-95 transition"
                    >
                      <FaAngleRight size={14} />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsFullScreenImage(true)}
                  className="absolute top-3 right-3 bg-white border border-[var(--prada-border)] p-2.5 text-[var(--prada-black)] active:scale-95 transition"
                >
                  <FaExpand size={12} />
                </button>
              </div>

              {currentImages.length > 1 && (
                <>
                  <div className="flex justify-center gap-1.5 mt-3">
                    {currentImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={
                          "transition-all " +
                          (selectedImageIndex === idx
                            ? "w-4 h-[3px] bg-[var(--prada-black)]"
                            : "w-[6px] h-[3px] bg-[var(--prada-border)]")
                        }
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {currentImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={
                          "flex-shrink-0 w-14 h-14 bg-white p-1 border transition " +
                          (selectedImageIndex === idx
                            ? "border-[var(--prada-black)]"
                            : "border-[var(--prada-border)]")
                        }
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop layout */}
            <div
              className="hidden md:flex gap-4 lg:gap-6 sticky top-36"
              style={{ height: "calc(100vh - 180px)" }}
            >
              <div className="flex flex-col gap-2.5 w-16 lg:w-20 flex-shrink-0">
                <button
                  onClick={handlePrevImage}
                  className="py-2 text-[var(--prada-mid-gray)] hover:text-[var(--prada-black)] transition-colors flex justify-center"
                >
                  <FaAngleUp size={18} />
                </button>

                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={
                        "w-full aspect-square bg-white p-1.5 border transition " +
                        (selectedImageIndex === idx
                          ? "border-[var(--prada-black)]"
                          : "border-[var(--prada-border)] hover:border-[var(--prada-mid-gray)]")
                      }
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextImage}
                  className="py-2 text-[var(--prada-mid-gray)] hover:text-[var(--prada-black)] transition-colors flex justify-center"
                >
                  <FaAngleDown size={18} />
                </button>
              </div>

              <div className="flex-1 bg-white overflow-hidden flex items-center justify-center p-8 lg:p-12 border border-[var(--prada-border)] relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedColor + "-" + selectedImageIndex}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3, ease: springEase }}
                    src={currentImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain max-h-[70vh]"
                  />
                </AnimatePresence>

                <button
                  onClick={() => setIsFullScreenImage(true)}
                  className="absolute top-4 right-4 bg-white border border-[var(--prada-border)] p-3 text-[var(--prada-black)] hover:bg-[var(--prada-off-white)] transition"
                >
                  <FaExpand size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="md:pt-3 md:sticky md:top-36">
            <div className="border border-[var(--prada-border)] bg-white p-6 sm:p-8 lg:p-10 relative">
              {product.price > product.discountPrice && (
                <span className="absolute -top-[1px] right-6 bg-[var(--brand-accent)] text-white text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5">
                  Sale
                </span>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5 text-sm text-[var(--prada-black)]">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i}>&#9733;</span>
                    ))}
                </div>
                <span className="text-[10px] tracking-[0.05em] text-[var(--prada-mid-gray)] cursor-pointer hover:text-[var(--prada-black)] transition-colors">
                  30 Reviews
                </span>
              </div>

              <h1 className="text-2xl sm:text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-[var(--prada-black)] leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-sm text-[var(--prada-mid-gray)] mt-2 leading-relaxed">
                  {product.tagline}
                </p>
              )}

              <div className="flex items-baseline gap-3 mt-6 pb-6 border-b border-[var(--prada-border)]">
                <span className="text-xl sm:text-2xl font-bold text-[var(--prada-black)]">
                  Rs.{product.discountPrice?.toLocaleString()}
                </span>
                {product.price > product.discountPrice && (
                  <>
                    <span className="text-sm text-[var(--prada-mid-gray)] line-through">
                      Rs.{product.price?.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--brand-accent)] tracking-[0.05em]">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {product.colors?.length > 0 && (
                <div className="mt-6 pb-6 border-b border-[var(--prada-border)]">
                  <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-3">
                    Color:{" "}
                    <span className="font-normal text-[var(--prada-mid-gray)] normal-case">
                      {product.colors.find((c) => c.hex === selectedColor)
                        ?.name || ""}
                    </span>
                  </p>
                  <div className="flex gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color._id}
                        onClick={() => setSelectedColor(color.hex)}
                        className={
                          "w-7 h-7 rounded-full border transition " +
                          (selectedColor === color.hex
                            ? "border-[var(--prada-black)] ring-1 ring-[var(--prada-black)] ring-offset-2"
                            : "border-[var(--prada-border)] hover:border-[var(--prada-mid-gray)]")
                        }
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p
                  className={
                    "text-[10px] font-semibold tracking-[0.08em] uppercase " +
                    (product.stock > 0
                      ? "text-[var(--prada-black)]"
                      : "text-[var(--brand-accent)]")
                  }
                >
                  {product.stock > 0
                    ? Math.min(product.stock, 18) + " in stock"
                    : "Out of stock"}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => addToCart(product._id, false)}
                  disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
                  className={
                    "w-full py-3.5 text-[10px] font-semibold tracking-[0.1em] uppercase border transition active:scale-[0.98] disabled:cursor-not-allowed " +
                    (product.stock <= 0
                      ? "border-[var(--prada-border)] text-[var(--prada-mid-gray)]"
                      : "bg-[var(--prada-black)] text-white border-[var(--prada-black)] hover:bg-black/90")
                  }
                >
                  {isAddingToCart
                    ? "Adding"
                    : product.stock <= 0
                      ? "Unavailable"
                      : "Add to Cart"}
                </button>

                <button
                  onClick={() => addToCart(product._id, true)}
                  disabled={isAddingToCart || isBuyingNow || product.stock <= 0}
                  className={
                    "w-full py-3.5 text-[10px] font-semibold tracking-[0.1em] uppercase border transition active:scale-[0.98] disabled:cursor-not-allowed " +
                    (product.stock <= 0
                      ? "border-[var(--prada-border)] text-[var(--prada-mid-gray)]"
                      : "border-[var(--prada-black)] text-[var(--prada-black)] hover:bg-[var(--prada-black)] hover:text-white")
                  }
                >
                  {isBuyingNow
                    ? "Processing"
                    : product.stock <= 0
                      ? "Unavailable"
                      : "Buy It Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: Features & Specs ── */}
      <div className="max-w-[1080px] mx-auto px-[clamp(16px,4vw,40px)] mt-14 md:mt-20">
        <div className="border-t border-[var(--prada-border)] pt-10 md:pt-14">
          <h2 className="text-lg md:text-xl font-bold text-[var(--prada-black)] tracking-tight">
            Features & Specs
          </h2>
          <p className="text-sm text-[var(--prada-mid-gray)] leading-relaxed mt-4 max-w-[65ch]">
            {product.description}
          </p>

          {product.technicalSpecs &&
            Object.keys(product.technicalSpecs).length > 0 && (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 pt-8 border-t border-[var(--prada-border)]">
                {Object.entries(product.technicalSpecs).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-1">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-sm text-[var(--prada-mid-gray)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* ── Reviews ── */}
        <div className="mt-14 md:mt-20 pt-10 md:pt-14 border-t border-[var(--prada-border)]">
          <Reviews selectedProduct={product.name} />
        </div>
      </div>

      {/* ── Full Screen Modal ── */}
      <AnimatePresence>
        {isFullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-[1000] flex items-center justify-center"
            onClick={() => setIsFullScreenImage(false)}
          >
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white border border-[var(--prada-border)] p-3 text-[var(--prada-black)] z-10 active:scale-95 transition"
              onClick={() => setIsFullScreenImage(false)}
            >
              <FaTimes size={16} />
            </button>

            {currentImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white border border-[var(--prada-border)] p-3 text-[var(--prada-black)] z-10 active:scale-95 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <FaAngleLeft size={16} />
                </button>
                <button
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white border border-[var(--prada-border)] p-3 text-[var(--prada-black)] z-10 active:scale-95 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <FaAngleRight size={16} />
                </button>
              </>
            )}

            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: springEase }}
              src={currentImages[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain p-6"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDisplay;
