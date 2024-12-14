import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectMongoDB = async (req, res) => {
  const uri = process.env.ATLAS_URI;
  try {
    await mongoose.connect(uri);
    console.log(`Mongo server connected`);
  } catch (error) {
    res.status(400).send(`Error connecting to the server. ${error}`)
    process.exit(1);
  }
}

export default connectMongoDB;