import mongoose from "mongoose";

const saleDetailSchema = new mongoose.Schema({
    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    idVenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

export const SaleDetail = mongoose.model('SaleDetail', saleDetailSchema);