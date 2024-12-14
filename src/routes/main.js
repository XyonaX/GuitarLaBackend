import { Router } from "express";
import authRouter from "./authRoutes.js";
import usersRouter from "./usersRoutes.js";
import blogRouter from "./blogRoutes.js";
import productsRouter from "./productsRoutes.js";
import paymentRouter from './paymentRoutes.js';
import ordersRouter from "./ordersRoutes.js";

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/users', usersRouter);
mainRouter.use('/blogs', blogRouter);
mainRouter.use('/products', productsRouter);
mainRouter.use('/payment', paymentRouter);
mainRouter.use('/orders', ordersRouter);


export default mainRouter;