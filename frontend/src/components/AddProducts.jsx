import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import axios from 'axios';
import AdminBackLink from './AdminBackLink';

const ProductManagement = () => {
    // State for product list and loading
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state — each color carries its own images/newFiles/imagePreviews
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        price: '',
        discountPrice: '',
        stock: '',
        category: '',
        description: '',
        technicalSpecs: {
            material: '',
            dimensions: '',
            weight: '',
            careInstructions: ''
        },
        colors: [{ name: '', hex: '#000000', images: [], newFiles: [], imagePreviews: [] }],
        features: [''],
    });

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const getAuthToken = () => {
        const directToken = localStorage.getItem('token');
        if (directToken) {
            const normalized = directToken.replace(/^Bearer\s+/i, '');
            console.log('[AddProducts] Token found in localStorage.token', {
                length: normalized.length,
            });
            return normalized;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const fallback = (user?.token || '').replace(/^Bearer\s+/i, '');
            console.log('[AddProducts] Token fallback from localStorage.user.token', {
                hasUserToken: Boolean(user?.token),
                length: fallback.length,
            });
            return fallback;
        } catch {
            console.log('[AddProducts] Failed to parse localStorage.user for token');
            return '';
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);
            setProducts(response.data.products);
            console.log("Products fetched:", response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const emptyColor = () => ({ name: '', hex: '#000000', images: [], newFiles: [], imagePreviews: [] });

    // Initialize form for adding new product
    const handleAddNew = () => {
        setFormData({
            name: '',
            tagline: '',
            price: '',
            discountPrice: '',
            stock: '',
            category: '',
            description: '',
            technicalSpecs: {
                material: '',
                dimensions: '',
                weight: '',
                careInstructions: ''
            },
            colors: [emptyColor()],
            features: [''],
        });
        setEditingProductId(null);
        setError('');
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Initialize form for editing existing product
    const handleEdit = (product) => {
        const productData = {
            name: product.name || '',
            tagline: product.tagline || '',
            price: product.price || '',
            discountPrice: product.discountPrice || '',
            stock: product.stock || '',
            category: product.category || '',
            description: product.description || '',
            technicalSpecs: product.technicalSpecs || {
                material: '',
                dimensions: '',
                weight: '',
                careInstructions: ''
            },
            colors: product.colors?.length > 0
                ? product.colors.map(color => ({
                    name: typeof color === 'object' ? color.name : color,
                    hex: typeof color === 'object' ? color.hex : '#000000',
                    images: (typeof color === 'object' ? color.images : []) || [],
                    newFiles: [],
                    imagePreviews: [],
                }))
                : [emptyColor()],
            features: product.features?.length > 0 ? product.features : [''],
        };

        setFormData(productData);
        setEditingProductId(product._id);
        setError('');
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Handle form cancellation
    const handleCancel = () => {
        // Revoke any object URLs
        formData.colors.forEach(c => c.imagePreviews.forEach(url => URL.revokeObjectURL(url)));
        setShowForm(false);
        setEditingProductId(null);
        setError('');
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle color related functions
    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, emptyColor()]
        }));
    };

    const removeColor = (index) => {
        setFormData(prev => {
            // Revoke object URLs for removed color previews
            prev.colors[index].imagePreviews.forEach(url => URL.revokeObjectURL(url));
            return {
                ...prev,
                colors: prev.colors.filter((_, i) => i !== index)
            };
        });
    };

    const handleColorChange = (index, field, value) => {
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            updatedColors[index] = { ...updatedColors[index], [field]: value };
            return { ...prev, colors: updatedColors };
        });
    };

    // Per-color image upload
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

    // Remove an existing (Cloudinary) image from a color
    const handleRemoveExistingColorImage = (colorIndex, imgUrl) => {
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            updatedColors[colorIndex] = {
                ...updatedColors[colorIndex],
                images: updatedColors[colorIndex].images.filter(url => url !== imgUrl),
            };
            return { ...prev, colors: updatedColors };
        });
    };

    // Remove a newly added (not yet uploaded) file from a color
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

    // Handle feature related functions
    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index, value) => {
        setFormData(prev => {
            const updatedFeatures = [...prev.features];
            updatedFeatures[index] = value;
            return { ...prev, features: updatedFeatures };
        });
    };

    // Handle form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        console.log('[AddProducts] handleSubmit started', {
            editingProductId,
            colorsCount: formData.colors.length,
            featuresCount: formData.features.length,
        });

        try {
            const productFormData = new FormData();

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                tagline: formData.tagline || '',
                discountPrice: Number(formData.discountPrice) || 0,
                technicalSpecs: formData.technicalSpecs || {},
                colors: formData.colors.map(color => ({
                    name: color.name,
                    hex: color.hex,
                })),
                features: formData.features.filter(feature => feature.trim() !== '') || [],
            };

            if (editingProductId) {
                productData._id = editingProductId;
            }

            console.log('[AddProducts] Prepared productData', {
                id: productData._id || null,
                name: productData.name,
                category: productData.category,
                colorsCount: productData.colors.length,
                featuresCount: productData.features.length,
            });

            productFormData.append('productData', JSON.stringify(productData));

            // Per-color existing images and new files
            formData.colors.forEach((color, i) => {
                productFormData.append(`existingColorImages_${i}`, JSON.stringify(color.images));
                color.newFiles.forEach(file => {
                    productFormData.append(`colorImages_${i}`, file);
                });
                console.log('[AddProducts] Appended color payload', {
                    colorIndex: i,
                    existingImagesCount: color.images.length,
                    newFilesCount: color.newFiles.length,
                });
            });

            const token = getAuthToken();
            if (!token) {
                console.log('[AddProducts] No auth token available. Aborting submit.');
                toast.error('Authentication failed. Please log in again.');
                setIsSubmitting(false);
                return;
            }

            const isEdit = Boolean(editingProductId);
            const url = isEdit
                ? `${import.meta.env.VITE_BACKEND_URL}/admin/edit-product/${editingProductId}`
                : `${import.meta.env.VITE_BACKEND_URL}/admin/add-product`;
            console.log('[AddProducts] Sending submit request', {
                method: isEdit ? 'PUT' : 'POST',
                url,
            });

            isEdit
                ? await axios.put(url, productFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                : await axios.post(url, productFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                    withCredentials: true,
                });

            console.log('[AddProducts] Submit request success', {
                isEdit,
                id: editingProductId || null,
            });

            toast.success(isEdit ? 'Product updated!' : 'Product added!');
            setShowForm(false);
            setEditingProductId(null);
            await fetchProducts();
        } catch (err) {
            console.error('[AddProducts] Submit error', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                responseData: err.response?.data,
                url: err.config?.url,
                method: err.config?.method,
            });
            setError(err?.response?.data?.message || err.message || 'An error occurred');
            toast.error(err?.response?.data?.message || err.message || 'An error occurred');
        } finally {
            console.log('[AddProducts] handleSubmit finished');
            setIsSubmitting(false);
        }
    };

    // Handle product deletion
    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        console.log('[AddProducts] deleteProduct started', { productId });

        try {
            const token = getAuthToken();
            if (!token) {
                console.log('[AddProducts] No auth token available. Aborting delete.');
                toast.error("Authentication failed. Please log in again.");
                return;
            }

            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/delete-product/${productId}`;
            console.log('[AddProducts] Sending delete request', { url });

            const res=await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            console.log('[AddProducts] Delete request success', {
                status: res.status,
                data: res.data,
            });
            toast.success('Product deleted successfully!');
            await fetchProducts();
        } catch (error) {
            console.error('[AddProducts] Delete request error', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                url: error.config?.url,
                method: error.config?.method,
            });
            toast.error(error?.response?.data?.message || 'Error deleting product. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <AdminBackLink />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Add New Product
                    </button>
                )}
                {showForm && (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-6">{editingProductId ? 'Update Product' : 'Add New Product'}</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tagline</label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="women-bags">Womens Bags</option>
                                <option value="men-wallets">Mens Wallets</option>
                                <option value="leather-belts">Leather Belts</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        ></textarea>
                    </div>

                    {/* Technical Specs */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Material</label>
                                <input
                                    type="text"
                                    name="technicalSpecs.material"
                                    value={formData.technicalSpecs.material}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                                <input
                                    type="text"
                                    name="technicalSpecs.dimensions"
                                    value={formData.technicalSpecs.dimensions}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Weight</label>
                                <input
                                    type="text"
                                    name="technicalSpecs.weight"
                                    value={formData.technicalSpecs.weight}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Care Instructions</label>
                                <input
                                    type="text"
                                    name="technicalSpecs.careInstructions"
                                    value={formData.technicalSpecs.careInstructions}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors — each color has its own image upload */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Colors & Images</h3>
                            <button
                                type="button"
                                onClick={addColor}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Add Color
                            </button>
                        </div>

                        {formData.colors.map((color, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                {/* Color name + hex picker */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Color Name</label>
                                        <input
                                            type="text"
                                            value={color.name}
                                            onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Hex Color</label>
                                        <div className="flex items-center mt-1">
                                            <input
                                                type="color"
                                                value={color.hex}
                                                onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                                className="h-10 w-10 rounded border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={color.hex}
                                                onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                                className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                pattern="^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeColor(index)}
                                        className="mt-6 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        disabled={formData.colors.length <= 1}
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Per-color image upload */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Images for <span style={{ color: color.hex }}>■</span> {color.name || 'this color'}
                                        </label>
                                        <label
                                            htmlFor={`colorImgs_${index}`}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer text-sm"
                                        >
                                            Upload Images
                                        </label>
                                        <input
                                            id={`colorImgs_${index}`}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleColorFileChange(index, e)}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Existing images (edit mode) */}
                                    {color.images.length > 0 && (
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-2">
                                            {color.images.map((url, imgIdx) => (
                                                <div key={imgIdx} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`${color.name} ${imgIdx + 1}`}
                                                        className="h-24 w-full object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingColorImage(index, url)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">saved</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* New file previews */}
                                    {color.imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                            {color.imagePreviews.map((src, fileIdx) => (
                                                <div key={fileIdx} className="relative">
                                                    <img
                                                        src={src}
                                                        alt={`preview ${fileIdx + 1}`}
                                                        className="h-24 w-full object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewColorFile(index, fileIdx)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{color.newFiles[fileIdx]?.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {color.images.length === 0 && color.imagePreviews.length === 0 && (
                                        <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md">
                                            <p className="text-gray-500 text-sm">No images yet. Upload images for this color.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Features</h3>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Add Feature
                            </button>
                        </div>

                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 mb-3">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    disabled={formData.features.length <= 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (editingProductId ? 'Updating Product...' : 'Adding Product...')
                                : (editingProductId ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            )}

            {/* Product List */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Product List</h2>

                {loading ? (
                    <p className="text-center py-4">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="text-center py-4">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition duration-300"
                            >
                                <img
                                    src={product.colors?.[0]?.images?.[0] || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h1 className="text-lg font-semibold text-gray-800">{product.name}</h1>
                                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                    <p className="text-sm font-medium text-gray-900 mb-4">${product.price}</p>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                                        >
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
