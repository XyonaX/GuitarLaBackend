import { Router } from "express";
import { createProductHandler, deleteProductHandler, getAllProductsHandler, getOneProductHandler, updateProductHandler, updateStockHandler } from "../handlers/productsHandler.js";
import { verifyToken } from "../middleware/verifyMiddleware.js";
import { authorizeAdmin } from "../middleware/authorizationMiddleware.js";

const productsRouter = Router();

// Get All Products
productsRouter.get('/', getAllProductsHandler);
// Get One Product
productsRouter.get('/:id', getOneProductHandler)
// Create Product
productsRouter.post('/create', verifyToken, authorizeAdmin, createProductHandler);
// Update Product
productsRouter.put('/update/:id', verifyToken, authorizeAdmin, updateProductHandler);
// Delete Product
productsRouter.delete('/delete/:id', verifyToken, authorizeAdmin, deleteProductHandler);
//Update Stock
productsRouter.post('/updateStock',verifyToken ,updateStockHandler);

export default productsRouter;