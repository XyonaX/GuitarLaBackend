import Product from '../schema/Products.js'

const getAllProductsController = async () => {
  if (!Product) throw new Error("Products not found");
  return await Product.find();

}
const getOneProductController = async (productID) => {
  const product = await Product.findById(productID);
  return product;
}
const createProductController = async (productName, description, shortDescription, price, isAvailable, stock, imageUrl) => {
  const newProduct = new Product({ productName, description, shortDescription, price, isAvailable, stock, imageUrl });
  return await newProduct.save();
}
const updateProductController = async (productID, productName, description, shortDescription, price, isAvailable, stock, imageUrl) => {
  const productData = { productName, description, shortDescription, price, isAvailable, stock, imageUrl };
  const updatedProduct = await Product.findByIdAndUpdate(productID, productData, { new: true });

  return updatedProduct;
}
const deleteProductController = async (productID) => {
  const existProduct = await Product.findById(productID);

  if (existProduct) {
    return existProduct.deleteOne();
  }
}

export {
  getAllProductsController,
  getOneProductController,
  createProductController,
  updateProductController,
  deleteProductController
}