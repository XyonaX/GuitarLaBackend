import { Router } from "express";
import { verifyToken } from "../middleware/verifyMiddleware.js";
import { getOrders } from "../controllers/SalesController.js";

const ordersRouter = Router();

// Ruta para obtener las órdenes de un usuario autenticado
ordersRouter.get('/', verifyToken, getOrders);

export default ordersRouter;