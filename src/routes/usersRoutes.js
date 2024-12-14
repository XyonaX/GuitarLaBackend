import { Router } from "express";
import { createUserHandler, deleteUserHandler, getAllUsersHandler, getOneUserHandler, updateUserHandler } from "../handlers/usersHandler.js";
import { verifyToken } from "../middleware/verifyMiddleware.js";
import { authorizeAdmin } from "../middleware/authorizationMiddleware.js";

const usersRouter = Router();

// Get All Users
usersRouter.get('/', getAllUsersHandler);
// Get One User
usersRouter.get('/:id',  verifyToken, getOneUserHandler);
// Create User
usersRouter.post('/create', verifyToken, authorizeAdmin, createUserHandler);
// Update User
usersRouter.put('/update/:id', verifyToken, updateUserHandler);
// Delete User
usersRouter.delete('/delete/:id', verifyToken, authorizeAdmin, deleteUserHandler);

export default usersRouter;