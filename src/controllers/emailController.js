// src/controllers/emailController.js
import emailHelper from '../helpers/emailHelper.js';

const sendEmail = async (req, res) => {
  const { userEmail, subject, text } = req.body;

  // Validación básica en el backend
  if (!userEmail || !subject || !text) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(userEmail)) {
    return res.status(400).send("Dirección de correo electrónico no válida.");
  }

  try {

    const emailInfo = await emailHelper(userEmail, subject, text); // 
    res.status(200).send(emailInfo.message); // Cambié para enviar el mensaje de éxito
  } catch (error) {
    // Manejo de otros errores
    res.status(500).send(`Error sending email: ${error.message}`);
  }
};

export default sendEmail;