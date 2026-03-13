

import express from 'express';
import cloudinary, { cloudinaryConnect } from '../config/cloudinary.js';
import upload from '../middleware/multer.js';
import productModel from '../models/product.model.js';
import orderModel from '../models/Checkout.model.js'
import userModel from '../models/user.model.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import bcrypt from 'bcrypt'


import { addProduct,editProduct,deleteProduct } from '../controller/product.controller.js';

const router = express();
cloudinaryConnect();

// Allowed leather categories for validation
const allowedCategories = ['bags', 'wallets', 'belts', 'accessories'];

// Helper function to upload images to Cloudinary
const uploadImgsToCloudinary = async (files) => {
    try {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path)
        );
        const results = await Promise.all(uploadPromises);
        return results.map(result => result.secure_url);
    } catch (error) {
        console.error('Error uploading images:', error);
    }
};


router.post('/add-product', verifyAdmin, upload.array('images', 5), addProduct);
router.put('/edit-product/:id', verifyAdmin, upload.array('images', 5), editProduct);
router.delete('/delete-product/:id', verifyAdmin, deleteProduct);




router.post('/add-user', verifyAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});
router.post('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json({ message: "User deleted successfully", user });
        } else {
            res.status(404).json({ message: "User with this ID does not exist" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
});
router.delete('/cancel-order/:id', async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId)
    try {
        const order = await orderModel.findOneAndDelete({ _id: orderId })
        console.log(order)
        if (!order) {
            return res.status(404).json({ message: "no order found" })
        }
        res.status(200).json({ message: "order deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
})




export default router;
