import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    visitCount: {
        // it will keep the reocrd of the specific visited product 
        type: Number,
    },
    tagline: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['women-bags', 'mens-wallets','leather-belts',  'accessories'],
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    colors: [
        {
            name: { type: String, required: true },
            hex: { type: String, required: true, match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/ }
        }
    ],
    features: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    technicalSpecs: {
        material: { type: String, required: true },
        dimensions: { type: String, required: true },
        weight: { type: String, required: true },
        careInstructions: { type: String, required: true }
    },
    img: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
