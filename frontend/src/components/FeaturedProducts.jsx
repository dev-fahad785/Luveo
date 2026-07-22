import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import AlertMessage from "./Alert";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "New In" },
  { value: "price-low", label: "Price: Low" },
  { value: "price-high", label: "Price: High" },
  { value: "popular", label: "Top Rated" },
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [globalAlert, setGlobalAlert] = useState({ message: "", type: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showGuestSign, setShowGuestSign] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserId(u.id ?? u.user?.id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/product/get-products?featured=true&limit=7`
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setProducts(data.products);
      } catch (e) {
        setError("Unable to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addToCart = useCallback(
    async (productId) => {
      if (!userId) {
        setShowGuestSign(true);
        return;
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/product/add-to-cart`,
          { productId, userId }
        );
        setGlobalAlert({ message: res.data.message, type: "success" });
      } catch (e) {
        setGlobalAlert({
          message: e.response?.data?.message || e.message,
          type: "error",
        });
      }
    },
    [userId]
  );

  const handleGuestAcct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/guest-signup`
      );
      const user = res.data?.newUser;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
      }
    } catch {}
  };

  const sortedProducts = useMemo(() => {
    const arr = [...products];
    switch (sortBy) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price);
      case "price-high":
        return arr.sort((a, b) => b.price - a.price);
      case "popular":
        return arr.sort(
          (a, b) =>
            (b.reviewCount || 0) * (b.rating || 0) -
            (a.reviewCount || 0) * (a.rating || 0)
        );
      default:
        return arr.sort(
          (a, b) =>
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
        );
    }
  }, [products, sortBy]);

  return (
    <section>
      {globalAlert.message && (
        <div className="mb-6">
          <AlertMessage
            message={globalAlert.message}
            type={globalAlert.type}
            onClose={() => setGlobalAlert({ message: "", type: "" })}
          />
        </div>
      )}

      {showGuestSign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white p-8 max-w-sm w-[90%] text-center">
            <p className="text-lg font-bold text-[var(--prada-black)] mb-2">
              Sign in
            </p>
            <p className="text-sm text-[var(--prada-gray)] mb-6">
              Create a guest account to add items to your cart.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowGuestSign(false)}
                className="px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase border border-[var(--prada-black)] text-[var(--prada-black)] transition-colors hover:bg-[var(--prada-black)] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGuestAcct}
                className="px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase bg-[var(--prada-black)] text-white transition-colors hover:bg-black/80"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[var(--prada-border)]">
          <span className="text-xs text-[var(--prada-mid-gray)] font-mono tracking-[0.05em]">
            {sortedProducts.length} items
          </span>
          <div className="flex items-center gap-5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={
                  "text-xs tracking-[0.08em] uppercase transition-colors " +
                  (sortBy === opt.value
                    ? "text-[var(--prada-black)] font-semibold"
                    : "text-[var(--prada-mid-gray)] font-medium hover:text-[var(--prada-black)]")
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-[var(--prada-gray)] font-medium py-12">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCard key={"sk-" + i} loading />
              ))
            : sortedProducts.length > 0
              ? sortedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} loading={false} />
                ))
              : null}
        </div>

        {!loading && sortedProducts.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--prada-mid-gray)]">
              No products available
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
