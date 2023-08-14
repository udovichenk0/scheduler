// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
