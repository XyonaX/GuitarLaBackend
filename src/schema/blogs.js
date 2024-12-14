import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String }, // Imagen asociada al blog
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
  updatedAt: { type: Date, default: Date.now }, // Fecha de actualización
  isPublished: { type: Boolean, default: true } // Estado de publicación del blog
});

// Modelo de Blog
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
