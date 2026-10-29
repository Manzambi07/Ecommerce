// server.js (ou app.js) - PRIMEIRA LINHA
require('dotenv').config();
const templateCodigo = require('./emailTemplate');


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarEmail = async (para, codigo) => {
  await transporter.sendMail({
    from: `"Ecommerce N-tech Solutions" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: 'Seu Código de Verificação',
    text: `Seu código de verificação é: ${codigo}`,
    html: templateCodigo(codigo, 'Ecommerce N-Tech solutions')
  });
};

module.exports = enviarEmail;