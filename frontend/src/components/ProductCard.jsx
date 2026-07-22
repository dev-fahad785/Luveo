import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product, loading }) => {
  const [userId, setUserId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user?.id || user?._id || "");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addToCart = async (productId) => {
    setIsAddingToCart(true);
    try {
      let uid = userId;
      if (!uid) {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/user/guest-signup"
        );
        const user = res.data?.newUser;
        const id = user?.id || user?._id;
        if (!id) throw new Error("Unable to create guest account");
        localStorage.setItem("user", JSON.stringify(user));
        setUserId(id);
        uid = id;
      }
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/product/add-to-cart",
        { productId, userId: uid }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const primaryImage =
    product?.colors?.[0]?.images?.[0] || product?.img?.[0];
  const secondaryImage =
    product?.colors?.[0]?.images?.[1] || product?.img?.[1] || primaryImage;
  const hasDiscount = product?.price > product?.discountPrice;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;
  const outOfStock = product?.stock <= 0;

  if (loading) return <SkeletonCard />;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col bg-white border border-[var(--prada-border)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
    >
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 text-[9px] font-semibold tracking-[0.08em] uppercase bg-[var(--brand-accent)] text-white px-2 py-1">
          {discountPct}% off
        </span>
      )}

      {outOfStock && (
        <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--prada-black)]">
            Sold Out
          </span>
        </div>
      )}

      <Link to={"/product/" + product._id} className="block">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--prada-off-white)]">
          <img
            src={hovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2.5">
        <Link to={"/product/" + product._id} className="no-underline">
          <h3 className="text-sm font-semibold text-[var(--prada-black)] leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 5).map((color, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-[var(--prada-border)]"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-xs text-[var(--prada-mid-gray)] line-through">
              Rs.{product.price?.toLocaleString()}
            </span>
          )}
          <span className="text-sm font-bold text-[var(--prada-black)]">
            Rs.{product.discountPrice?.toLocaleString()}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product._id);
          }}
          disabled={isAddingToCart || outOfStock}
          className={
            "mt-1 w-full py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase border transition-all duration-200 " +
            (outOfStock
              ? "border-[var(--prada-border)] text-[var(--prada-mid-gray)] cursor-not-allowed"
              : "border-[var(--prada-black)] text-[var(--prada-black)] hover:bg-[var(--prada-black)] hover:text-white active:scale-[0.98]")
          }
        >
          {isAddingToCart ? "Adding" : outOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col bg-white border border-[var(--prada-border)] animate-pulse">
    <div className="w-full aspect-[4/5] bg-[var(--prada-off-white)]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 w-3/4 bg-[var(--prada-light-gray)]" />
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[var(--prada-light-gray)]" />
        <div className="w-3 h-3 rounded-full bg-[var(--prada-light-gray)]" />
        <div className="w-3 h-3 rounded-full bg-[var(--prada-light-gray)]" />
      </div>
      <div className="h-4 w-1/3 bg-[var(--prada-light-gray)]" />
      <div className="h-9 w-full bg-[var(--prada-light-gray)] mt-1" />
    </div>
  </div>
);

export default ProductCard;
