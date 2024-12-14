import { Router } from "express";
import { createBlogHandler, deleteBlogHandler, getAllBlogsHandler, getOneBlogHandler, updateBlogHandler } from "../handlers/blogHandler.js";
import { verifyToken } from "../middleware/verifyMiddleware.js";
import { authorizeAdmin } from "../middleware/authorizationMiddleware.js";

const blogRouter = Router();

// Get All Blogs
blogRouter.get('/', getAllBlogsHandler);

// Get One Blog
blogRouter.get('/:id', getOneBlogHandler);

// Create Blog
blogRouter.post('/create', createBlogHandler, verifyToken, authorizeAdmin);

// Update Blog
blogRouter.put('/update/:id', updateBlogHandler,verifyToken, authorizeAdmin);

// Delete Blog
blogRouter.delete('/delete/:id', deleteBlogHandler,verifyToken, authorizeAdmin);


export default blogRouter;
