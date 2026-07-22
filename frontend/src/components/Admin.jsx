import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBox, FiUsers, FiTrendingUp, FiShoppingCart, FiBell, FiLogOut, FiMenu, FiX, FiChevronRight } from 'react-icons/fi';

const navItems = [
  { path: "/add-product", label: "Products", icon: FiBox },
  { path: "/add-users", label: "Users", icon: FiUsers },
  { path: "/analytics", label: "Analytics", icon: FiTrendingUp },
  { path: "/orders", label: "Orders", icon: FiShoppingCart },
  { path: "/notification", label: "Notifications", icon: FiBell },
];

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50" },
  packing: { label: "Packing", color: "text-blue-700", bg: "bg-blue-50" },
  shipped: { label: "Shipped", color: "text-indigo-700", bg: "bg-indigo-50" },
  delievered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50" },
};

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    usersCount: 0,
    productCount: 0,
    revenue: 0,
    pendingOrders: 0,
    packingOrders: 0,
    shippedOrders: 0,
    delieveredOrders: 0,
    recentOrders: [],
  });

  const formatCurrency = (amount) =>
    "Rs." + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const safeFetch = async (url, fallback) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return fallback;
        return (await res.json().catch(() => fallback)) ?? fallback;
      } catch {
        return fallback;
      }
    };

    try {
      const [usersData, productsData, revenueData, ordersData] = await Promise.all([
        safeFetch(import.meta.env.VITE_BACKEND_URL + "/user/get-users", []),
        safeFetch(import.meta.env.VITE_BACKEND_URL + "/product/get-products", { products: [] }),
        safeFetch(import.meta.env.VITE_BACKEND_URL + "/analytics/total-revenue", { totalRevenue: 0 }),
        safeFetch(import.meta.env.VITE_BACKEND_URL + "/analytics/all-orders", { orders: [] }),
      ]);

      const orders = ordersData?.orders || [];
      let pending = 0, packing = 0, shipped = 0, delievered = 0;
      orders.forEach((order) => {
        const s = order?.orderStatus?.toLowerCase();
        if (s === "pending") pending++;
        else if (s === "packing") packing++;
        else if (s === "delievered") delievered++;
        else if (s === "shipped") shipped++;
      });

      setDashboardData({
        usersCount: Array.isArray(usersData) ? usersData.length : 0,
        productCount: productsData?.products?.length || 0,
        revenue: Number(revenueData?.totalRevenue) || 0,
        pendingOrders: pending,
        packingOrders: packing,
        shippedOrders: shipped,
        delieveredOrders: delievered,
        recentOrders: orders,
      });
    } catch {
      setDashboardData({
        usersCount: 0, productCount: 0, revenue: 0,
        pendingOrders: 0, packingOrders: 0, shippedOrders: 0,
        delieveredOrders: 0, recentOrders: [],
      });
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 600000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const statCards = [
    { title: "Total Users", value: dashboardData.usersCount, accent: "border-l-[var(--prada-black)]" },
    { title: "Total Products", value: dashboardData.productCount, accent: "border-l-[var(--prada-mid-gray)]" },
    { title: "Revenue", value: formatCurrency(dashboardData.revenue), accent: "border-l-[var(--prada-black)]" },
    { title: "Pending", value: dashboardData.pendingOrders, accent: "border-l-yellow-600" },
    { title: "Packing", value: dashboardData.packingOrders, accent: "border-l-blue-600" },
    { title: "Shipped", value: dashboardData.shippedOrders, accent: "border-l-indigo-600" },
    { title: "Delivered", value: dashboardData.delieveredOrders, accent: "border-l-green-600" },
  ];

  return (
    <div className="flex h-screen bg-[var(--prada-off-white)]">
      <button
        className="fixed z-30 bottom-6 right-6 lg:hidden bg-[var(--prada-black)] text-white p-3"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX size={16} /> : <FiMenu size={16} />}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <nav
        className={
          "fixed lg:relative z-20 h-full bg-[var(--prada-black)] text-white transition-all duration-300 flex flex-col " +
          (sidebarOpen ? "w-64" : "w-0 -ml-64 lg:w-64 lg:ml-0")
        }
      >
        <div className="flex flex-col h-full px-5 py-6">
          <div className="pb-6 mb-6 border-b border-white/10">
            <Link to="/" className="text-lg font-bold tracking-[0.15em] uppercase">
              LuvEo
            </Link>
            <p className="text-[10px] text-white/40 font-mono tracking-[0.15em] uppercase mt-2">
              Admin Panel
            </p>
          </div>

          <div className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={
                    "flex items-center gap-3 px-4 py-2.5 text-xs tracking-[0.05em] font-medium transition-colors " +
                    (active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5")
                  }
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button className="flex items-center gap-3 px-4 py-2.5 text-xs tracking-[0.05em] text-white/50 hover:text-white hover:bg-white/5 w-full transition-colors">
              <FiLogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-lg font-bold text-[var(--prada-black)] tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-[var(--prada-mid-gray)] font-mono tracking-[0.05em] mt-1">
                Welcome back, Admin
              </p>
            </div>

            {error && (
              <div className="text-[10px] text-[var(--brand-accent)] bg-red-50 border border-red-200 px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-white border border-[var(--prada-border)] p-5 animate-pulse">
                  <div className="h-3 w-1/3 bg-[var(--prada-light-gray)] mb-3" />
                  <div className="h-6 w-1/2 bg-[var(--prada-light-gray)]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <div
                  key={i}
                  className={
                    "bg-white border border-[var(--prada-border)] p-5 border-l-4 " +
                    stat.accent
                  }
                >
                  <p className="text-[10px] font-mono tracking-[0.08em] uppercase text-[var(--prada-mid-gray)] mb-1.5">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-[var(--prada-black)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white border border-[var(--prada-border)]">
            <div className="px-5 py-4 border-b border-[var(--prada-border)] flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)]">
                Recent Orders
              </h2>
              <Link
                to="/orders"
                className="text-[10px] font-mono text-[var(--prada-mid-gray)] hover:text-[var(--prada-black)] transition-colors flex items-center gap-1"
              >
                View all <FiChevronRight size={10} />
              </Link>
            </div>

            {isLoading ? (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[var(--prada-off-white)] animate-pulse" />
                ))}
              </div>
            ) : dashboardData.recentOrders.length > 0 ? (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.recentOrders.slice(0, 6).map((item, idx) => {
                  const status = item.orderStatus?.toLowerCase() || "pending";
                  const cfg = statusConfig[status] || statusConfig.pending;
                  return (
                    <div
                      key={item._id || idx}
                      className="border border-[var(--prada-border)] p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={"w-7 h-7 flex items-center justify-center " + cfg.bg}>
                          <span className={"text-[10px] font-bold " + cfg.color}>
                            {status === "pending" ? "P" : status === "packing" ? "K" : status === "shipped" ? "S" : "D"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--prada-black)] truncate">
                            {item.name || "Guest"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[var(--prada-mid-gray)]">Amount</span>
                          <span className="font-semibold text-[var(--prada-black)]">
                            {formatCurrency(item.orderTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--prada-mid-gray)]">City</span>
                          <span className="text-[var(--prada-black)]">{item.city || "\u2014"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--prada-mid-gray)]">Date</span>
                          <span className="text-[var(--prada-mid-gray)]">
                            {formatDate(item.orderDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--prada-mid-gray)]">Status</span>
                          <span className={"font-semibold " + cfg.color}>{cfg.label}</span>
                        </div>
                      </div>

                      <Link
                        to="/orders"
                        className="mt-3 block text-[10px] font-mono text-[var(--prada-mid-gray)] hover:text-[var(--prada-black)] transition-colors"
                      >
                        View Order &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-[10px] font-mono tracking-[0.08em] uppercase text-[var(--prada-mid-gray)]">
                  No recent orders
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
