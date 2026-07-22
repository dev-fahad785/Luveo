import { useState, useEffect, useRef } from 'react';
import AdminBackLink from './AdminBackLink';

const Analytics = () => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [chartType, setChartType] = useState('revenue');
  const chartRef = useRef(null);
  const [theme, setTheme] = useState('dark');

  const [analyticsData, setAnalyticsData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUser: 0,
    totalSales: 0,
    totalCoupons: 0,
    totalDiscountAmount: 0,
  });

  const [filteredProducts, setFilteredProducts] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState('all');

  const [chartPoints, setChartPoints] = useState([]);

  const containerRef = useRef(null);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/admin/analytics');
      const data = await response.json();
      const totals = {
        totalProducts: data.totalProducts,
        totalOrders: data.totalOrders,
        totalUser: data.totalUser,
        totalSales: data.totalSales,
        totalCoupons: data.totalCoupons,
        totalDiscountAmount: data.totalDiscountAmount,
      };
      setAnalyticsData(totals);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/analytics?timeFrame=${timeFrame}`);
        const data = await response.json();
        setChartPoints(data.chartData || []);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchChartData();
  }, [timeFrame]);

  const drawChart = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    const padding = 40;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    ctx.clearRect(0, 0, w, h);

    const isDark = theme === 'dark';
    ctx.strokeStyle = isDark ? '#333' : '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    if (!chartPoints.length) {
      ctx.fillStyle = isDark ? '#666' : '#9CA3AF';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No data', w / 2, h / 2);
      return;
    }

    const values = chartType === 'revenue' ? chartPoints.map((p) => p.totalSales) : chartPoints.map((p) => p.orderCount);
    const maxVal = Math.max(...values, 1);
    const points = chartPoints.map((p, i) => {
      const x = padding + (chartW / Math.max(chartPoints.length - 1, 1)) * i;
      const y = padding + chartH - (values[i] / maxVal) * chartH;
      return { x, y, label: p._id, value: values[i] };
    });

    ctx.beginPath();
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 2;
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#121212';
      ctx.fill();
    });
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(drawChart, 100);
    window.addEventListener('resize', drawChart);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', drawChart);
    };
  }, [chartPoints, theme, chartType]);

  const filteredCount = [
    { label: 'all', count: analyticsData.totalProducts, set: () => setFilteredProducts('all') },
    { label: 'visible', count: 0, set: () => setFilteredProducts('visible') },
    { label: 'hidden', count: 0, set: () => setFilteredProducts('hidden') },
  ];

  const orderFilteredCount = [
    { label: 'all', count: analyticsData.totalOrders, set: () => setFilteredOrders('all') },
    { label: 'pending', count: 0, set: () => setFilteredOrders('pending') },
    { label: 'shipped', count: 0, set: () => setFilteredOrders('shipped') },
    { label: 'delivered', count: 0, set: () => setFilteredOrders('delivered') },
    { label: 'cancelled', count: 0, set: () => setFilteredOrders('cancelled') },
    { label: 'return', count: 0, set: () => setFilteredOrders('return') },
  ];

  const handleFilterClick = (setter) => { setter(); };

  return (
    <div ref={containerRef} className="px-[clamp(16px,4vw,40px)] py-8">
      <AdminBackLink />

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)]">
          Analytics
        </h2>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setChartType('revenue')}
            className={`px-3 py-2 text-[9px] font-semibold tracking-[0.08em] uppercase border transition-colors ${chartType === 'revenue' ? 'bg-[var(--prada-black)] text-white border-[var(--prada-black)]' : 'border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)]'}`}
          >
            Revenue
          </button>
          <button
            onClick={() => setChartType('orders')}
            className={`px-3 py-2 text-[9px] font-semibold tracking-[0.08em] uppercase border transition-colors ${chartType === 'orders' ? 'bg-[var(--prada-black)] text-white border-[var(--prada-black)]' : 'border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)]'}`}
          >
            Orders
          </button>
        </div>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="border border-[var(--prada-border)] px-3 py-2 text-xs text-[var(--prada-black)] outline-none bg-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total Products', value: analyticsData.totalProducts },
          { label: 'Total Orders', value: analyticsData.totalOrders },
          { label: 'Total Users', value: analyticsData.totalUser },
          { label: 'Total Sales', value: '$' + (analyticsData.totalSales || 0).toLocaleString() },
          { label: 'Total Coupons', value: analyticsData.totalCoupons },
          { label: 'Total Discount', value: '$' + (analyticsData.totalDiscountAmount || 0).toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="border border-[var(--prada-border)] bg-white p-4">
            <p className="text-[9px] font-mono tracking-[0.08em] uppercase text-[var(--prada-mid-gray)] mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-[var(--prada-black)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-[var(--prada-border)] bg-white p-4 sm:p-6 mb-8">
        <canvas
          ref={canvasRef}
          className="w-full h-72"
          style={{ display: 'block' }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[var(--prada-border)] bg-white p-4 sm:p-6">
          <h3 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-4">
            Products
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {filteredCount.map((f) => (
              <button key={f.label} onClick={() => handleFilterClick(f.set)}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.08em] border transition-colors ${filteredProducts === f.label ? 'bg-[var(--prada-black)] text-white border-[var(--prada-black)]' : 'border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)]'}`}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">
            Filter controls — product data required for breakdown.
          </p>
        </div>

        <div className="border border-[var(--prada-border)] bg-white p-4 sm:p-6">
          <h3 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-4">
            Orders
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {orderFilteredCount.map((f) => (
              <button key={f.label} onClick={() => handleFilterClick(f.set)}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.08em] border transition-colors ${filteredOrders === f.label ? 'bg-[var(--prada-black)] text-white border-[var(--prada-black)]' : 'border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)]'}`}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">
            Filter controls — order data required for breakdown.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
