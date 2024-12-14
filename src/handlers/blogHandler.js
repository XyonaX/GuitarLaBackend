import mongoose from 'mongoose';
import { createBlogController, deleteBlogController, getAllBlogsController, getOneBlogController, updateBlogController } from '../controllers/blogController.js';
import Blog from '../schema/blogs.js';
import { uploadBlogImage, deleteImageFromCloudinary } from '../utilities/cloudinary.js';

const getAllBlogsHandler = async (req, res) => {
  try {
    const response = await getAllBlogsController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Error fetching blogs: ${error.message}` });
  }
};

const getOneBlogHandler = async (req, res) => {
  try {
    const { id: blogID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogID)) {
      return res.status(400).json({ error: 'The ID isn´t valid' });
    }

    const response = await getOneBlogController(blogID);

    if (!response) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blog: ' + error.message });
  }
};

const createBlogHandler = async (req, res) => {
  try {
    const { title, content, author, imageUrl } = req.body; // Ahora recibes directamente la URL

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const response = await createBlogController(title, content, author, imageUrl); // imageUrl viene directamente del cliente

    return res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error creating blog: ' + error.message });
  }
};


const updateBlogHandler = async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const { title, content, author, imageUrl } = req.body; // URL proporcionada por el cliente

    const existingBlog = await Blog.findById(blogID);

    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Actualiza los datos directamente, incluida la nueva URL de la imagen si se proporciona
    const response = await updateBlogController(blogID, title, content, author, imageUrl);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Error updating the blog: ${error.message}` });
  }
};


const deleteBlogHandler = async (req, res) => {
  try {
    const { id: blogID } = req.params;

    const blog = await Blog.findById(blogID);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Elimina el blog directamente
    await deleteBlogController(blogID);

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting blog:', error.message);
    res.status(500).json({ error: `Error deleting the blog: ${error.message}` });
  }
};




export {
  getAllBlogsHandler,
  getOneBlogHandler,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler
};
