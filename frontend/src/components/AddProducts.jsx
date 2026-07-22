import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminBackLink from './AdminBackLink';
import { PRODUCT_CATEGORY_OPTIONS } from '../lib/productCategories';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', tagline: '', price: '', discountPrice: '', stock: '',
        featured: false, category: '', description: '',
        technicalSpecs: { material: '', dimensions: '', weight: '', careInstructions: '' },
        colors: [{ name: '', hex: '#000000', images: [], newFiles: [], imagePreviews: [] }],
        features: [''],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const getAuthToken = () => {
        const directToken = localStorage.getItem('token');
        if (directToken) return directToken.replace(/^Bearer\s+/i, '');
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return (user?.token || '').replace(/^Bearer\s+/i, '');
        } catch { return ''; }
    };

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error("Failed to fetch products");
        } finally { setLoading(false); }
    };

    const emptyColor = () => ({ name: '', hex: '#000000', images: [], newFiles: [], imagePreviews: [] });

    const handleAddNew = () => {
        setFormData({ name: '', tagline: '', price: '', discountPrice: '', stock: '', featured: false, category: '', description: '', technicalSpecs: { material: '', dimensions: '', weight: '', careInstructions: '' }, colors: [emptyColor()], features: [''] });
        setEditingProductId(null);
        setError('');
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || '', tagline: product.tagline || '', price: product.price || '',
            discountPrice: product.discountPrice || '', stock: product.stock || '',
            featured: Boolean(product.featured), category: product.category || '',
            description: product.description || '',
            technicalSpecs: product.technicalSpecs || { material: '', dimensions: '', weight: '', careInstructions: '' },
            colors: product.colors?.length > 0
                ? product.colors.map(color => ({
                    name: typeof color === 'object' ? color.name : color,
                    hex: typeof color === 'object' ? color.hex : '#000000',
                    images: (typeof color === 'object' ? color.images : []) || [],
                    newFiles: [], imagePreviews: [],
                  }))
                : [emptyColor()],
            features: product.features?.length > 0 ? product.features : [''],
        });
        setEditingProductId(product._id);
        setError('');
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        formData.colors.forEach(c => c.imagePreviews.forEach(url => URL.revokeObjectURL(url)));
        setShowForm(false);
        setEditingProductId(null);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const addColor = () => setFormData(prev => ({ ...prev, colors: [...prev.colors, emptyColor()] }));
    const removeColor = (index) => {
        setFormData(prev => {
            prev.colors[index].imagePreviews.forEach(url => URL.revokeObjectURL(url));
            return { ...prev, colors: prev.colors.filter((_, i) => i !== index) };
        });
    };

    const handleColorChange = (index, field, value) => {
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            updatedColors[index] = { ...updatedColors[index], [field]: value };
            return { ...prev, colors: updatedColors };
        });
    };

    const handleColorFileChange = (colorIndex, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            updatedColors[colorIndex] = {
                ...updatedColors[colorIndex],
                newFiles: [...updatedColors[colorIndex].newFiles, ...files],
                imagePreviews: [...updatedColors[colorIndex].imagePreviews, ...newPreviews],
            };
            return { ...prev, colors: updatedColors };
        });
    };

    const handleRemoveExistingColorImage = (colorIndex, imgUrl) => {
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            updatedColors[colorIndex] = { ...updatedColors[colorIndex], images: updatedColors[colorIndex].images.filter(url => url !== imgUrl) };
            return { ...prev, colors: updatedColors };
        });
    };

    const handleRemoveNewColorFile = (colorIndex, fileIndex) => {
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            const col = updatedColors[colorIndex];
            URL.revokeObjectURL(col.imagePreviews[fileIndex]);
            updatedColors[colorIndex] = {
                ...col,
                newFiles: col.newFiles.filter((_, i) => i !== fileIndex),
                imagePreviews: col.imagePreviews.filter((_, i) => i !== fileIndex),
            };
            return { ...prev, colors: updatedColors };
        });
    };

    const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeFeature = (index) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    const handleFeatureChange = (index, value) => {
        setFormData(prev => {
            const updatedFeatures = [...prev.features];
            updatedFeatures[index] = value;
            return { ...prev, features: updatedFeatures };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const productFormData = new FormData();
            const productData = {
                name: formData.name, description: formData.description,
                price: Number(formData.price), stock: Number(formData.stock),
                category: formData.category.trim().toLowerCase(), tagline: formData.tagline || '',
                discountPrice: Number(formData.discountPrice) || 0, featured: Boolean(formData.featured),
                technicalSpecs: formData.technicalSpecs || {},
                colors: formData.colors.map(color => ({ name: color.name, hex: color.hex })),
                features: formData.features.filter(feature => feature.trim() !== '') || [],
            };
            if (editingProductId) productData._id = editingProductId;
            productFormData.append('productData', JSON.stringify(productData));
            formData.colors.forEach((color, i) => {
                productFormData.append(`existingColorImages_${i}`, JSON.stringify(color.images));
                color.newFiles.forEach(file => productFormData.append(`colorImages_${i}`, file));
            });
            const token = getAuthToken();
            if (!token) { toast.error('Authentication failed. Please log in again.'); setIsSubmitting(false); return; }
            const isEdit = Boolean(editingProductId);
            const url = isEdit
                ? `${import.meta.env.VITE_BACKEND_URL}/admin/edit-product/${editingProductId}`
                : `${import.meta.env.VITE_BACKEND_URL}/admin/add-product`;
            isEdit
                ? await axios.put(url, productFormData, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
                : await axios.post(url, productFormData, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            toast.success(isEdit ? 'Product updated!' : 'Product added!');
            setShowForm(false);
            setEditingProductId(null);
            await fetchProducts();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'An error occurred');
            toast.error(err?.response?.data?.message || err.message || 'An error occurred');
        } finally { setIsSubmitting(false); }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = getAuthToken();
            if (!token) { toast.error("Authentication failed. Please log in again."); return; }
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
            });
            toast.success('Product deleted successfully!');
            await fetchProducts();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting product. Please try again.');
        }
    };

    return (
        <div className="px-[clamp(16px,4vw,40px)] py-8">
            <AdminBackLink />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)]">
                    Product Management
                </h2>
                {!showForm && (
                    <button onClick={handleAddNew}
                        className="px-4 py-2.5 text-[9px] font-semibold tracking-[0.08em] uppercase bg-[var(--prada-black)] text-white border border-[var(--prada-black)] hover:bg-black/90 transition-colors active:scale-[0.98]">
                        Add New Product
                    </button>
                )}
                {showForm && (
                    <button onClick={handleCancel}
                        className="px-4 py-2.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)] hover:text-[var(--prada-black)] transition-colors">
                        Cancel
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="border border-[var(--prada-border)] bg-white p-6 sm:p-8 mb-8 space-y-6">
                    <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-[var(--prada-black)]">
                        {editingProductId ? 'Update Product' : 'Add New Product'}
                    </h3>

                    {error && (
                        <div className="border border-[var(--brand-accent)] p-3">
                            <p className="text-[10px] font-mono text-[var(--brand-accent)]">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { label: 'Name', name: 'name', type: 'text' },
                            { label: 'Tagline', name: 'tagline', type: 'text' },
                            { label: 'Price', name: 'price', type: 'number' },
                            { label: 'Discount Price', name: 'discountPrice', type: 'number' },
                            { label: 'Stock', name: 'stock', type: 'number' },
                        ].map(({ label, name, type }) => (
                            <div key={name}>
                                <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">{label}</label>
                                <input type={type} name={name} value={formData[name]} onChange={handleChange}
                                    className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
                                    min="0" step={type === 'number' ? '0.01' : undefined} required />
                            </div>
                        ))}
                        <div>
                            <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}
                                className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors bg-white" required>
                                <option value="">Select a category</option>
                                {PRODUCT_CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <input id="featured" type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                                className="w-4 h-4 border border-[var(--prada-border)] text-[var(--prada-black)]" />
                            <label htmlFor="featured" className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)]">
                                Show on home page (featured)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                            className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors" required />
                    </div>

                    <div className="border-t border-[var(--prada-border)] pt-5">
                        <h4 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-4">Technical Specifications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['material', 'dimensions', 'weight', 'careInstructions'].map((spec) => (
                                <div key={spec}>
                                    <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
                                        {spec === 'careInstructions' ? 'Care Instructions' : spec.charAt(0).toUpperCase() + spec.slice(1)}
                                    </label>
                                    <input type="text" name={`technicalSpecs.${spec}`} value={formData.technicalSpecs[spec]} onChange={handleChange}
                                        className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors" required />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[var(--prada-border)] pt-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)]">Colors & Images</h4>
                            <button type="button" onClick={addColor}
                                className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-black)] text-[var(--prada-black)] hover:bg-[var(--prada-black)] hover:text-white transition-colors">
                                Add Color
                            </button>
                        </div>
                        {formData.colors.map((color, index) => (
                            <div key={index} className="mb-5 border border-[var(--prada-border)] p-4">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">Color Name</label>
                                        <input type="text" value={color.name} onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                            className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors" required />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">Hex Color</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                                className="w-10 h-10 border border-[var(--prada-border)] p-0.5" />
                                            <input type="text" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                                className="flex-1 border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
                                                pattern="^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$" required />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeColor(index)}
                                        disabled={formData.colors.length <= 1}
                                        className="mt-6 px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white transition-colors disabled:opacity-40">
                                        Remove
                                    </button>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)]">
                                            Images <span style={{ color: color.hex }}>&#9632;</span> {color.name || 'this color'}
                                        </label>
                                        <label htmlFor={`colorImgs_${index}`}
                                            className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-black)] text-[var(--prada-black)] hover:bg-[var(--prada-black)] hover:text-white transition-colors cursor-pointer">
                                            Upload Images
                                        </label>
                                        <input id={`colorImgs_${index}`} type="file" multiple accept="image/*" onChange={(e) => handleColorFileChange(index, e)} className="hidden" />
                                    </div>
                                    {color.images.length > 0 && (
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-2">
                                            {color.images.map((url, imgIdx) => (
                                                <div key={imgIdx} className="relative group">
                                                    <img src={url} alt={`${color.name} ${imgIdx + 1}`} className="h-24 w-full object-cover border border-[var(--prada-border)]" />
                                                    <button type="button" onClick={() => handleRemoveExistingColorImage(index, url)}
                                                        className="absolute top-0 right-0 bg-[var(--brand-accent)] text-white text-[9px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                                    <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] mt-0.5">saved</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {color.imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                            {color.imagePreviews.map((src, fileIdx) => (
                                                <div key={fileIdx} className="relative group">
                                                    <img src={src} alt={`preview ${fileIdx + 1}`} className="h-24 w-full object-cover border border-[var(--prada-border)]" />
                                                    <button type="button" onClick={() => handleRemoveNewColorFile(index, fileIdx)}
                                                        className="absolute top-0 right-0 bg-[var(--brand-accent)] text-white text-[9px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                                                    <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] mt-0.5 truncate">{color.newFiles[fileIdx]?.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {color.images.length === 0 && color.imagePreviews.length === 0 && (
                                        <div className="border border-[var(--prada-border)] border-dashed p-4 text-center">
                                            <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">No images yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[var(--prada-border)] pt-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)]">Features</h4>
                            <button type="button" onClick={addFeature}
                                className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-black)] text-[var(--prada-black)] hover:bg-[var(--prada-black)] hover:text-white transition-colors">
                                Add Feature
                            </button>
                        </div>
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 mb-2">
                                <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    className="flex-1 border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors" required />
                                <button type="button" onClick={() => removeFeature(index)}
                                    disabled={formData.features.length <= 1}
                                    className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white transition-colors disabled:opacity-40">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={isSubmitting}
                        className="w-full py-3 text-[10px] font-semibold tracking-[0.1em] uppercase bg-[var(--prada-black)] text-white border border-[var(--prada-black)] hover:bg-black/90 transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70">
                        {isSubmitting
                            ? (editingProductId ? 'Updating...' : 'Adding...')
                            : (editingProductId ? 'Update Product' : 'Add Product')}
                    </button>
                </form>
            )}

            <div>
                <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)] mb-4">
                    Product List
                </h3>
                {loading ? (
                    <p className="text-[10px] font-mono text-[var(--prada-mid-gray)] text-center py-4">Loading...</p>
                ) : products.length === 0 ? (
                    <p className="text-[10px] font-mono text-[var(--prada-mid-gray)] text-center py-4">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="border border-[var(--prada-border)] bg-white hover:border-[var(--prada-black)] transition-colors">
                                <img src={product.colors?.[0]?.images?.[0] || '/placeholder.png'} alt={product.name}
                                    className="w-full aspect-[4/5] object-cover border-b border-[var(--prada-border)]" />
                                <div className="p-3">
                                    <h4 className="text-xs font-bold text-[var(--prada-black)]">{product.name}</h4>
                                    <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] uppercase mt-0.5">{product.category}</p>
                                    <p className="text-[9px] font-mono text-[var(--prada-mid-gray)] mt-0.5">{product.featured ? 'Featured' : 'Not featured'}</p>
                                    <p className="text-sm font-bold text-[var(--prada-black)] mt-1">${product.price}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleEdit(product)}
                                            className="flex-1 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)] hover:text-[var(--prada-black)] transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteProduct(product._id)}
                                            className="flex-1 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
