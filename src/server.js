import express from 'express';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import mainRouter from './routes/main.js';
import sendEmail from './controllers/emailController.js';

const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.use(fileUpload({
  useTempFiles: true, // Utiliza archivos temporales en lugar de cargar archivos directamente en la memoria
  tempFileDir: './uploads' // Especifica el directorio donde se almacenarán los archivos temporales
}));

app.use('/api', mainRouter);

app.post('/send-email', sendEmail);

export default app;

