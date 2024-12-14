import mongoose  from "mongoose";

const SaleSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateOfSale:{
        type: Date,
        default: Date.now,
    },
    totalSale: {
        type: Number,
        required: true
    },
    saleDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SaleDetail",
        }
    ]

})

export const Sale = mongoose.model('Sale', SaleSchema);