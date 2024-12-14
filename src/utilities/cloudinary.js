import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configura Cloudinary con las credenciales de las variables de entorno
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});

// Función para subir una imagen a Cloudinary
export async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'replit', // Especifica la carpeta en Cloudinary
    });
    return result; // Devuelve el resutado
  } catch (error) {
    throw new Error('Error uploading image');
  }
}

// Función para subir una imagen asociada a un blog a Cloudinary
export async function uploadBlogImage(filePath) {
  try {
    console.log(`Starting upload for blog image: ${filePath}`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'blogs', // Carpeta para imágenes de blogs
    });
    console.log(`Blog image uploaded successfully: ${result.secure_url}`);
    return result; // Devuelve el resultado
  } catch (error) {
    console.error(`Error uploading blog image (${filePath}):`, error.message);
    throw new Error('Error uploading blog image');
  }
}


// Función para eliminar una imagen a Cloudinary
export async function deleteImageFromCloudinary(publicId) {
  try {
    console.log(`Starting deletion for image with publicId: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary delete result: ${JSON.stringify(result)}`); // Imprime el resultado
    if (result.result !== 'ok') {
      console.log(`Image with publicId ${publicId} deleted successfully.`);
      throw new Error(`Failed to delete image. ${result.result}`);
    }else {
      console.warn(`Failed to delete image with publicId ${publicId}. Result: ${result.result}`);
      throw new Error(`Failed to delete image. ${result.result}`);
    }
  } catch (error) {
    console.error(`Error deleting image with publicId ${publicId}:`, error.message);
    throw new Error(`Error deleting image. ${error}`);

  }
}
