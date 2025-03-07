import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const sendMessage = async (email, message, pdfurl = null, pdfname = null) => {
  console.log(email, message);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password (enable 2-FA)
    },
  });

  const mailOptions = {
    from: 'prashantbooks2025@gmail.com',
    to: email,
    subject: 'Your Pass Code',
    text: message,
    attachments: pdfurl
      ? [
        {
          filename: pdfname,
          path: pdfurl,
          contentType: 'application/pdf',
        },
      ]
      : [], // Empty array if no PDF file is provided

  };


  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.response);

  return info.response

}

export { sendMessage }