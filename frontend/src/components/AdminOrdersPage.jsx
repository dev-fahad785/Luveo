import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminBackLink from './AdminBackLink';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [statusMessages, setStatusMessages] = useState({});
    const [cancelState, setCancelState] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/all-orders`);
                setOrders(response.data.orders);
                setError(null);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 404) {
                    setOrders([]);
                    setError(null);
                } else {
                    setError('Failed to load orders. Please try again later.');
                }
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleOrderClick = (order) => setSelectedOrder(order);
    const closeOrderDetails = () => setSelectedOrder(null);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: '2-digit',
                hour: 'numeric', minute: '2-digit', hour12: true,
            });
        } catch { return dateString; }
    };

    const formatFieldLabel = (fieldName) => {
        if (!fieldName) return '';
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (char) => char.toUpperCase()).trim();
    };

    const renderFieldValue = (value) => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (Array.isArray(value)) return value.length === 0 ? '[]' : value.join(', ');
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/analytics/update-order-status`, {
                orderID: orderId, orderStatus: newStatus,
            });
            setStatusMessages(prev => ({ ...prev, [orderId]: res.data.message || 'Status updated!' }));
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            ));
            setTimeout(() => {
                setStatusMessages(prev => { const n = { ...prev }; delete n[orderId]; return n; });
            }, 3000);
        } catch (error) {
            setStatusMessages(prev => ({ ...prev, [orderId]: error.response?.data?.message || 'Error updating order' }));
            setTimeout(() => {
                setStatusMessages(prev => { const n = { ...prev }; delete n[orderId]; return n; });
            }, 3000);
        }
    };

    const cancelOrder = async (orderId) => {
        setCancelState(prev => ({ ...prev, [orderId]: { loading: true, message: null, error: false } }));
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/cancel-order/${orderId}`);
            setOrders(prev => prev.filter(o => o._id !== orderId));
            setCancelState(prev => ({ ...prev, [orderId]: { loading: false, message: 'Order cancelled', error: false } }));
        } catch {
            setCancelState(prev => ({ ...prev, [orderId]: { loading: false, message: 'Failed to cancel', error: true } }));
        }
        setTimeout(() => {
            setCancelState(prev => { const n = { ...prev }; delete n[orderId]; return n; });
        }, 3000);
    };

    if (loading) return (
        <div className="px-[clamp(16px,4vw,40px)] py-10">
            <AdminBackLink />
            <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">Loading orders...</p>
        </div>
    );

    if (error) return (
        <div className="px-[clamp(16px,4vw,40px)] py-10">
            <AdminBackLink />
            <div className="border border-[var(--brand-accent)] p-4">
                <p className="text-[10px] font-mono text-[var(--brand-accent)]">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="px-[clamp(16px,4vw,40px)] py-8">
            <AdminBackLink />
            <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)] mb-6">
                Order Management
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by email, name or order ID..."
                    className="flex-1 border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="packing">Packing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            <div className="overflow-x-auto border border-[var(--prada-border)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--prada-black)] text-white text-[10px] tracking-[0.08em] uppercase">
                            <th className="py-3 px-4 font-medium">Order Date</th>
                            <th className="py-3 px-4 font-medium">Customer</th>
                            <th className="py-3 px-4 font-medium">Items</th>
                            <th className="py-3 px-4 font-medium">Total</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Invoice</th>
                            <th className="py-3 px-4 font-medium">Order Status</th>
                            <th className="py-3 px-4 font-medium">Send Msg</th>
                            <th className="py-3 px-4 font-medium">Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="border-b border-[var(--prada-border)] text-sm hover:bg-[var(--prada-off-white)] transition-colors">
                                    <td className="py-3 px-4 text-[var(--prada-black)] whitespace-nowrap">{formatDate(order.orderDate)}</td>
                                    <td className="py-3 px-4">
                                        <p className="text-[var(--prada-black)]">{order.name || 'N/A'}</p>
                                        <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">{order.email}</p>
                                    </td>
                                    <td className="py-3 px-4 text-[var(--prada-mid-gray)]">{order.orderedProducts?.length || 0} items</td>
                                    <td className="py-3 px-4 font-bold text-[var(--prada-black)] whitespace-nowrap">{order.orderTotal}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <span className={`inline-block px-2 py-0.5 text-[9px] font-semibold tracking-[0.08em] uppercase border ${order.orderStatus === 'delivered' ? 'border-black text-black' : order.orderStatus === 'shipped' ? 'border-[var(--prada-mid-gray)] text-[var(--prada-mid-gray)]' : 'border-[var(--prada-border)] text-[var(--prada-mid-gray)]'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleOrderClick(order)}
                                            className="text-[9px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] underline underline-offset-2 hover:no-underline transition-all"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="border border-[var(--prada-border)] px-2 py-1 text-[10px] text-[var(--prada-black)] outline-none bg-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="packing">Packing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                        {statusMessages[order._id] && (
                                            <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] mt-1">{statusMessages[order._id]}</p>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <a
                                            href={`https://wa.me/${order.phone}?text=Hello, Dear Customer ${order.name}, your order had been successfully placed on Luveo of RS ${order.orderTotal}. Your Order status is : ${order.orderStatus}, and it will be delivered to you within 5-7 working days.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-black)] text-[var(--prada-black)] hover:bg-[var(--prada-black)] hover:text-white transition-colors"
                                        >
                                            WhatsApp
                                        </a>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white transition-colors disabled:opacity-50"
                                            onClick={() => cancelOrder(order._id)}
                                            disabled={cancelState[order._id]?.loading}
                                        >
                                            {cancelState[order._id]?.loading ? '...' : 'Cancel'}
                                        </button>
                                        {cancelState[order._id]?.message && (
                                            <p className={`text-[9px] font-mono mt-1 ${cancelState[order._id].error ? 'text-[var(--brand-accent)]' : 'text-[var(--prada-mid-gray)]'}`}>
                                                {cancelState[order._id].message}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-8 text-center text-[10px] font-mono text-[var(--prada-mid-gray)]">
                                    No orders received yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-[var(--prada-border)] max-w-4xl w-full max-h-screen overflow-auto">
                        <div className="sticky top-0 bg-white border-b border-[var(--prada-border)] p-4 flex items-center justify-between">
                            <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-[var(--prada-black)]">
                                Order Details
                            </h3>
                            <div className="flex items-center gap-4">
                                <button onClick={closeOrderDetails} className="text-[var(--prada-mid-gray)] hover:text-[var(--prada-black)] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <img className="w-16 h-auto object-contain" src="/images/logo.png" alt="Luveo" loading="eager" />
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="text-sm">
                                <h4 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-2">Order Details</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 border border-[var(--prada-border)] p-3">
                                    {[
                                        { label: 'Order ID', value: selectedOrder._id },
                                        { label: 'Order Date', value: formatDate(selectedOrder.orderDate) },
                                        { label: 'Status', value: selectedOrder.orderStatus },
                                        { label: 'Total', value: selectedOrder.orderTotal },
                                        { label: 'Customer', value: selectedOrder.name },
                                        { label: 'Contact', value: selectedOrder.phone },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] uppercase">{label}</p>
                                            <p className="text-xs font-semibold text-[var(--prada-black)] break-all">{value || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm">
                                <h4 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-2">Shipping Address</h4>
                                <div className="border border-[var(--prada-border)] p-3">
                                    <p className="text-xs text-[var(--prada-black)]">{selectedOrder.address || 'N/A'}</p>
                                    <p className="text-xs text-[var(--prada-mid-gray)]">
                                        {[selectedOrder.city, selectedOrder.province, selectedOrder.postalCode].filter(Boolean).join(', ')}
                                        {selectedOrder.country ? `, ${selectedOrder.country}` : ''}
                                    </p>
                                    {selectedOrder.orderNotes && (
                                        <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] mt-1">Notes: {selectedOrder.orderNotes}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-2">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.orderedProducts?.length ? (
                                        selectedOrder.orderedProducts.map((item, index) => {
                                            const lineTotal = Number(item.productPrice || 0) * Number(item.productQuantity || 1);
                                            const reservedKeys = new Set(['_id', 'productId', 'productName', 'productColor', 'productColorHex', 'productQuantity', 'productPrice', 'productImg']);
                                            const extraFields = Object.entries(item || {}).filter(([key]) => !reservedKeys.has(key));
                                            return (
                                                <div key={item._id || `${item.productId}-${index}`} className="border border-[var(--prada-border)] p-3">
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <h5 className="text-xs font-semibold text-[var(--prada-black)]">Item #{index + 1}: {item.productName || 'Unnamed'}</h5>
                                                        <span className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Line Total: {lineTotal}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                                                        <div><p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Item ID</p><p className="font-medium break-all">{item._id || 'N/A'}</p></div>
                                                        <div><p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Product ID</p><p className="font-medium break-all">{item.productId || 'N/A'}</p></div>
                                                        <div><p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Price</p><p className="font-medium">{item.productPrice ?? 'N/A'}</p></div>
                                                        <div><p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Qty</p><p className="font-medium">{item.productQuantity ?? 'N/A'}</p></div>
                                                        <div><p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Color</p><p className="font-medium">{item.productColor || 'N/A'}</p></div>
                                                        <div><p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">Hex</p><div className="flex items-center gap-2"><span className="font-medium">{item.productColor || 'N/A'}</span>{item.productColorHex && <span className="w-3 h-3 border border-[var(--prada-border)]" style={{ backgroundColor: item.productColorHex }} title={item.productColorHex} />}</div></div>
                                                    </div>
                                                    {extraFields.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] mb-1">Additional Fields</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                                                                {extraFields.map(([key, value]) => (
                                                                    <div key={key} className="border border-[var(--prada-border)] px-2 py-1">
                                                                        <p className="text-[9px] font-mono text-[var(--prada-mid-gray)]">{formatFieldLabel(key)}</p>
                                                                        <p className="font-medium break-words">{renderFieldValue(value)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-[var(--prada-mid-gray)] border border-[var(--prada-border)] p-3">No ordered products found.</p>
                                    )}
                                    <div className="border border-[var(--prada-border)] p-3 flex justify-end text-xs font-bold text-[var(--prada-black)]">
                                        Total: {selectedOrder.orderTotal}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)] hover:text-[var(--prada-black)] transition-colors"
                                    onClick={closeOrderDetails}
                                >
                                    Close
                                </button>
                                <button
                                    className="px-4 py-2 text-[9px] font-semibold tracking-[0.08em] uppercase bg-[var(--prada-black)] text-white border border-[var(--prada-black)] hover:bg-black/90 transition-colors active:scale-[0.98]"
                                    onClick={() => window.print()}
                                >
                                    Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
