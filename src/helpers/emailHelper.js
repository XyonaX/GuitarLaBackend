import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const adminGmail = process.env.gmail;
const passAppGmail = process.env.passAppGmail;

const emailHelper = async (userEmail, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: adminGmail,
      pass: passAppGmail,
    },
  });

  let mailOptions = {
    from: adminGmail,
    to: adminGmail,
    subject: subject,
    text: text,
    replyTo: userEmail,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email enviado con éxito' };
  } catch (error) {
    throw new Error('Error al enviar el email');
  }
};

export default emailHelper;