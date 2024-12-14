import connectMongoDB from './src/model/connectMongoDB.js';
import app from './src/server.js'
import dotenv from 'dotenv';

dotenv.config();

const serverApp = app;

const PORT = process.env.PORT || 3001;

const main = async () => {
  try {
    await connectMongoDB();
    serverApp.listen(PORT, () => {
      console.log(`Server listened on PORT: ${PORT}`)
    })
  } catch (error) {
    console.log(`Error connecting to the server. ${error.message}`)
  }
}

main();