import Blog from '../schema/blogs.js'; // Importa el esquema Blog

// Obtener todos los blogs
const getAllBlogsController = async () => {
  if (!Blog) throw new Error("Blogs not found");
  return await Blog.find();
};

// Obtener un blog por ID
const getOneBlogController = async (blogID) => {
  const blog = await Blog.findById(blogID);
  if (!blog) throw new Error("Blog not found");
  return blog;
};

// Crear un nuevo blog
const createBlogController = async (title, content, author, imageUrl) => {
  const newBlog = new Blog({ title, content, author, imageUrl });
  return await newBlog.save();
};

// Actualizar un blog existente
const updateBlogController = async (blogID, title, content, author, imageUrl) => {
  const blogData = { title, content, author, imageUrl };
  const updatedBlog = await Blog.findByIdAndUpdate(blogID, blogData, { new: true });
  if (!updatedBlog) throw new Error("Blog not found");
  return updatedBlog;
};

// Eliminar un blog por ID
const deleteBlogController = async (blogID) => {
  try {
    // Verifica si el blog existe
    const existBlog = await Blog.findById(blogID);
    if (!existBlog) throw new Error("Blog not found");

    // Si el blog tiene una imagen asociada, puedes agregar la lógica para eliminarla si es necesario
    if (existBlog.imageUrl) {
      // Lógica para eliminar la imagen si es necesario (por ejemplo, si la imagen está en un servidor propio o S3)
      // Si las imágenes están en un servidor propio, puedes eliminarla del sistema de archivos:
      // await deleteImageFromServer(existBlog.imageUrl);
      
      // Si las imágenes están en otro servicio (por ejemplo, AWS S3), puedes agregar la lógica aquí:
      // await deleteImageFromS3(existBlog.imageUrl);
    }

    // Elimina el blog de la base de datos
    await existBlog.deleteOne();
    return { message: "Blog deleted successfully" };

  } catch (error) {
    console.error(`Error deleting blog with ID ${blogID}:`, error.stack);
    throw new Error("Failed to delete blog");
  }
};

export {
  getAllBlogsController,
  getOneBlogController,
  createBlogController,
  updateBlogController,
  deleteBlogController
};
