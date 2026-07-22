import { useState, useEffect } from 'react';
import { PRODUCT_CATEGORY_OPTIONS } from '../lib/productCategories';
import { useParams } from 'react-router-dom';
import AdminBackLink from './AdminBackLink';

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
    } catch { return ''; }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/product/get-product/" + id);
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
          setEditableFields({
            name: data.product.name, price: data.product.price, description: data.product.description,
            stock: data.product.stock, category: String(data.product.category || '').toLowerCase(),
            SKU: data.product.SKU, tag: data.product.tag, size: data.product.size,
          });
          setImages(data.product.colors?.[0]?.images || []);
        }
      } catch (error) { console.error("Error fetching product:", error); }
    };
    fetchProduct();
  }, [id]);

  const handleEdit = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: field === "price" || field === "stock" ? (value === "" ? "" : parseInt(value, 10) || "") : value,
    }));
  };

  const handleFileChange = (event) => setSelectedFiles(prev => [...prev, ...Array.from(event.target.files)]);
  const handleRemoveImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));
  const handleRemoveSelectedImage = (index) => setSelectedFiles(prev => prev.filter((_, i) => i !== index));

  const handleUpdateProduct = async () => {
    setLoading(true);
    const formData = new FormData();
    const productData = {
      ...product, ...editableFields,
      price: Number(editableFields.price) || 0,
      stock: Number(editableFields.stock) || 0,
      category: String(editableFields.category || '').trim().toLowerCase(),
      discountPrice: Number(product.discountPrice) || 0,
      technicalSpecs: product.technicalSpecs || {},
      features: Array.isArray(product.features) ? product.features : [],
      colors: (product.colors || []).map((c) => ({ name: c.name, hex: c.hex })),
    };
    formData.append('productData', JSON.stringify(productData));
    formData.append('existingColorImages_0', JSON.stringify(images));
    selectedFiles.forEach(file => formData.append('colorImages_0', file));

    try {
      const token = getAuthToken();
      if (!token) { console.error("No token found"); setLoading(false); return; }
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/admin/edit-product/" + id, {
        method: 'PUT', body: formData,
        headers: { Authorization: "Bearer " + token }, credentials: "include",
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
    } catch (error) { console.error('Error updating product:', error); }
    finally { setLoading(false); }
  };

  if (!product) return (
    <div className="px-[clamp(16px,4vw,40px)] py-10">
      <AdminBackLink />
      <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-[clamp(16px,4vw,40px)] py-8">
      <AdminBackLink />
      <div className="border border-[var(--prada-border)] bg-white p-6 sm:p-8">
        <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)] mb-6">
          Edit Product
        </h2>

        <div className="space-y-5">
          {Object.entries(editableFields).map(([key, value]) => (
            <div key={key}>
              <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {key === 'category' ? (
                <select
                  value={value}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors bg-white"
                >
                  <option value="">Select category</option>
                  {PRODUCT_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
                  placeholder={"Edit " + key}
                />
              )}
            </div>
          ))}
        </div>

        {images.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-3">
              Current Images
            </p>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image} alt="" className="w-20 h-20 object-cover border border-[var(--prada-border)]" />
                  <button onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-[var(--brand-accent)] text-white text-[9px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] mb-3">
            Add New Images
          </p>
          <label className="block border border-[var(--prada-border)] border-dashed px-4 py-6 text-center cursor-pointer hover:border-[var(--prada-black)] transition-colors">
            <span className="text-[10px] font-mono text-[var(--prada-mid-gray)]">Click to select files</span>
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img src={URL.createObjectURL(file)} alt="" className="w-20 h-20 object-cover border border-[var(--prada-border)]" />
                <button onClick={() => handleRemoveSelectedImage(index)}
                  className="absolute top-0 right-0 bg-[var(--brand-accent)] text-white text-[9px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpdateProduct}
          disabled={loading}
          className="mt-6 w-full py-3 text-[10px] font-semibold tracking-[0.1em] uppercase bg-[var(--prada-black)] text-white border border-[var(--prada-black)] hover:bg-black/90 transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
