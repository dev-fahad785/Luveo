import cloudinary, { cloudinaryConnect } from '../config/cloudinary.js';
import productModel from '../models/product.model.js';

// Ensure Cloudinary is ready for uploads
cloudinaryConnect();

// Allowed leather categories for validation
const allowedCategories = ['bags', 'wallets', 'belts', 'accessories'];
const requiredSpecs = ['material', 'dimensions', 'weight', 'careInstructions'];

// Upload an array of files to Cloudinary and return their URLs
const uploadImgsToCloudinary = async (files) => {
	const uploadPromises = files.map(file => cloudinary.uploader.upload(file.path));
	const results = await Promise.all(uploadPromises);
	return results.map(result => result.secure_url);
};

export const addProduct = async (req, res) => {
	try {
		const productData = JSON.parse(req.body.productData);

		if (!productData.name || !productData.price || !productData.description ||
			!productData.stock || !productData.category || !productData.tagline ||
			!productData.discountPrice) {
			return res.status(400).json({
				message: 'Name, tagline, price, discountPrice, stock, category, and description are required fields'
			});
		}

		if (!allowedCategories.includes(productData.category)) {
			return res.status(400).json({
				message: `Category must be one of: ${allowedCategories.join(', ')}`
			});
		}

		if (productData.color) {
			productData.colors = productData.color;
			delete productData.color;
		}

		if (productData.colors && Array.isArray(productData.colors)) {
			const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
			for (const color of productData.colors) {
				if (!color.name || !color.hex) {
					return res.status(400).json({ message: 'Each color must have both a name and a hex value' });
				}
				if (!hexRegex.test(color.hex)) {
					return res.status(400).json({ message: `Invalid hex value for color: ${color.name}` });
				}
			}
		} else {
			return res.status(400).json({ message: 'Colors must be an array of color objects with name and hex fields' });
		}

		if (!Array.isArray(productData.features) || productData.features.length === 0) {
			return res.status(400).json({ message: 'Features must be a non-empty array of strings' });
		}

		const specs = productData.technicalSpecs;
		if (!specs || requiredSpecs.some(key => !specs[key])) {
			return res.status(400).json({
				message: 'Technical specs must include material, dimensions, weight, and careInstructions'
			});
		}

		const imageUrls = req.files?.length ? await uploadImgsToCloudinary(req.files) : [];
		if (!imageUrls.length) {
			return res.status(400).json({ message: 'At least one product image is required' });
		}

		const newProduct = new productModel({
			...productData,
			price: Number(productData.price),
			discountPrice: Number(productData.discountPrice),
			stock: Number(productData.stock),
			img: imageUrls
		});

		const savedProduct = await newProduct.save();

		res.status(201).json({
			message: 'Product added successfully',
			product: savedProduct
		});
	} catch (error) {
		console.error('Product creation error:', error);
		res.status(500).json({ message: 'Failed to add product', error: error.message });
	}
};

export const addProduct2 = async (req, res) => {
	try {
		const { name, tagline, price, discountPrice, description, stock, size, SKU, category, tag } = req.body;

		if (!name || !price || !stock) {
			return res.status(400).json({ message: 'Name, price, and stock are required' });
		}

		const imageUrls = req.files?.length ? await uploadImgsToCloudinary(req.files) : [];

		const product = new productModel({
			name,
			description,
			price: Number(price),
			stock: Number(stock),
			images: imageUrls,
			size,
			SKU,
			category,
			tag,
			tagline,
			discountPrice
		});

		await product.save();
		res.status(201).json({ message: 'Product created successfully', product });
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error', error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await productModel.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({ message: 'Product deleted', product });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const editProduct = async (req, res) => {
	try {
		const productData = JSON.parse(req.body.productData);

		if (!productData.name || !productData.price || !productData.description ||
			!productData.stock || !productData.category) {
			return res.status(400).json({ message: 'Name, price, stock, and description are required fields' });
		}

		if (productData.color) {
			productData.colors = productData.color;
			delete productData.color;
		}

		if (productData.colors && Array.isArray(productData.colors)) {
			const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
			for (const color of productData.colors) {
				if (!color.name || !color.hex) {
					return res.status(400).json({ message: 'Each color must have both a name and a hex value' });
				}
				if (!hexRegex.test(color.hex)) {
					return res.status(400).json({ message: `Invalid hex value for color: ${color.name}` });
				}
			}
		} else {
			return res.status(400).json({ message: 'Colors must be an array of color objects with name and hex fields' });
		}

		let imageUrls = req.body.images || [];
		if (req.files && req.files.length > 0) {
			const uploadedImages = await uploadImgsToCloudinary(req.files);
			imageUrls = [...imageUrls, ...uploadedImages];
		}

		const existingImages = JSON.parse(req.body.existingImages || '[]');
		const imagesToRemove = JSON.parse(req.body.imagesToRemove || '[]');
		imageUrls = existingImages.filter(img => !imagesToRemove.includes(img));

		const updatedProduct = await productModel.findByIdAndUpdate(
			req.params.id,
			{
				...productData,
				images: imageUrls,
			},
			{ new: true }
		);

		if (!updatedProduct) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
	} catch (error) {
		console.error('Error while updating the product:', error);
		res.status(500).json({ message: 'Error while updating the product', error: error.message });
	}
};
