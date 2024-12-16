import mongoose from "mongoose";
import { createProductController, deleteProductController, getAllProductsController, getOneProductController, updateProductController } from "../controllers/productsController.js";
import { deleteImageFromCloudinary, uploadImage } from '../utilities/cloudinary.js';
import Product from "../schema/Products.js";

const getAllProductsHandler = async (req, res) => {
  try {
    const response = await getAllProductsController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Error fetching products: ${error.message}` });
  }
};

const getOneProductHandler = async (req, res) => {
  try {
    const { id: productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ error: 'The ID isn´t valid' });
    }

    const response = await getOneProductController(productID);

    if (!response) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product: ' + error.message });
  }
};

const createProductHandler = async (req, res) => {
  try {
    const { productName, description, shortDescription, price, isAvailable, stock } = req.body;
    const image = req.files?.image;

    if (!productName || !description || !price || !stock) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    let imageUrl = null; // Inicializa variable para la URL de la imagen

    // Verifica si se ha subido una imagen
    if (image) {
      const result = await uploadImage(image.tempFilePath); // Sube la imagen
      imageUrl = result.secure_url; // Obtiene la URL segura de la imagen
    } else {
      return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen.' });
    }

    const response = await createProductController(productName, description, shortDescription, price, isAvailable, stock, imageUrl);

    return res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product: ' + error.message });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    const { id: productID } = req.params;
    const { productName, description, shortDescription, price, isAvailable, stock } = req.body;
    const image = req.files?.image;

    // Busca el producto existente para obtener la URL de la imagen actual
    const existingProduct = await Product.findById(productID);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let imageUrl = existingProduct.imageUrl; // Mantiene la URL actual por defecto

    if (image) {
      // Si hay una nueva imagen, elimina la anterior de Cloudinary
      if (existingProduct.imageUrl) {
        // Extrae el public_id de la URL
        const publicId = existingProduct.imageUrl.split('/').slice(-1)[0].split('.')[0]; // Obtiene el nombre del archivo sin extensión
        await deleteImageFromCloudinary(publicId);
      }

      const result = await uploadImage(image.tempFilePath);
      imageUrl = result.secure_url; // Actualiza con la nueva URL
    }

    const response = await updateProductController(productID, productName, description, shortDescription, price, isAvailable, stock, imageUrl);

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ error: `Error updating the product: ${error.message}` });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { id: productID } = req.params;

    const product = await Product.findById(productID);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.imageUrl) {
      const public_ID = product.imageUrl.split('/').slice(-2).join('/').split('.')[0];
      await deleteImageFromCloudinary(public_ID);
    }

    await deleteProductController(productID);

    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ error: `Error deleting the product: ${error.message}` });
  }
};

const updateStockHandler = async (req, res) => {
  console.log('Received request to update stock', req.body);
  try {
      const { products } = req.body;

      // Añadir log para ver el número de productos recibidos
      console.log(`Updating stock for ${products.length} products`);

      for (const product of products) {
          console.log(`Processing product: ${product.id}`);
          const existingProduct = await Product.findById(product.id);

          if (!existingProduct) {
              console.log(`Product not found: ${product.id}`);
              return res.status(404).json({ error: `Producto con ID ${product.id} no encontrado.` });
          }

          if (existingProduct.stock < product.quantity) {
              console.log(`Insufficient stock for: ${product.id}`);
              return res.status(400).json({
                  error: `Stock insuficiente para el producto ${existingProduct.productName}.`,
              });
          }

          // Actualización del stock
          await Product.findByIdAndUpdate(product.id, {
              $inc: { stock: -product.quantity },
          });
      }

      console.log('Stock update successful');
      res.status(200).json({ message: "Stock actualizado correctamente." });
  } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({ error: `Error al actualizar el stock: ${error.message}` });
  }
};




export {
  getAllProductsHandler,
  getOneProductHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  updateStockHandler
};