
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminBackLink from './AdminBackLink';
import { PRODUCT_CATEGORY_OPTIONS } from '../lib/productCategories';

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editableFields, setEditableFields] = useState({
        name: '', price: '', description: '', stock: '', size: '', category: '', SKU: '', tag: '',
    });
    const [images, setImages] = useState([]);

    const getAuthToken = () => {
        const directToken = localStorage.getItem('token');
        if (directToken) return directToken.replace(/^Bearer\s+/i, '');

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return (user?.token || '').replace(/^Bearer\s+/i, '');
        } catch {
            return '';
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-product/${id}`);
                const data = await response.json();
                if (data.product) {
                    setProduct(data.product);
                    setEditableFields({
                        name: data.product.name,
                        price: data.product.price,
                        description: data.product.description,
                        stock: data.product.stock,
                        category: String(data.product.category || '').toLowerCase(),
                        SKU: data.product.SKU,
                        tag: data.product.tag,
                        size: data.product.size,
                    });
                    setImages(data.product.colors?.[0]?.images || []);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);



    const handleEdit = (field, value) => {
        setEditableFields(prev => ({
            ...prev,
            [field]: field === "price" || field === "stock" ? (value === "" ? "" : parseInt(value, 10) || "") : value
        }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveSelectedImage = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateProduct = async () => {
        setLoading(true);
        const formData = new FormData();

        const productData = {
            ...product,
            ...editableFields,
            price: Number(editableFields.price) || 0,
            stock: Number(editableFields.stock) || 0,
            category: String(editableFields.category || '').trim().toLowerCase(),
            discountPrice: Number(product.discountPrice) || 0,
            technicalSpecs: product.technicalSpecs || {},
            features: Array.isArray(product.features) ? product.features : [],
            colors: (product.colors || []).map((color) => ({
                name: color.name,
                hex: color.hex,
            })),
        };

        formData.append('productData', JSON.stringify(productData));
        formData.append('existingColorImages_0', JSON.stringify(images));
        selectedFiles.forEach(file => formData.append('colorImages_0', file));

        try {
            const token = getAuthToken();
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-product/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                credentials: "include"
            });

            if (response.ok) {
                alert('Product updated successfully');
                const updatedProduct = await response.json();
                setProduct(updatedProduct.product);
                setImages(updatedProduct.product.colors?.[0]?.images || []);
                setSelectedFiles([]);
            } else {
                const errorPayload = await response.json().catch(() => ({}));
                alert(errorPayload?.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto bg-gray-100 p-6 md:p-8 rounded-lg">
            <AdminBackLink />
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>

            {Object.entries(editableFields).map(([key, value]) => (
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    {key === 'category' ? (
                        <select
                            key={key}
                            name={key}
                            value={value}
                            onChange={(e) => handleEdit(key, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select category</option>
                            {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            key={key}
                            type="text"
                            name={key}
                            value={value}
                            onChange={(e) => handleEdit(key, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder={`Edit ${key}`}
                        />
                    )}
                </div>

            ))}
            <div className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">


            </div>

            <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img src={image} alt="Product" className="w-24 h-24 object-cover rounded-lg" />
                        <button onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">X</button>
                    </div>
                ))}
            </div>

            <input type="file" multiple onChange={handleFileChange} className="my-3" />

            <div className="flex flex-wrap gap-4 mt-3">
                {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                        <button onClick={() => handleRemoveSelectedImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">X</button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleUpdateProduct}
                className="bg-blue-500 text-white p-2 rounded mt-4"
                disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
            </button>
        </div>
    );
};

export default EditProduct;