import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  stock: { type: Number, default: 50 },
  imageUrl: { type: String },
})

const Product = mongoose.model('Product', productSchema);

export default Product;