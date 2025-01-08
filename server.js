const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (if your HTML file is in a folder like 'public')
app.use(express.static('public'));

// Route to handle form submission
app.post('/send', async (req, res) => {
  const { name, email, contact, message } = req.body;

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service (e.g., Yahoo, Outlook)
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.PASSWORD, // Your email password or app password
    },
  });

  const mailOptions = {
    from: email, // Sender's email
    to: process.env.EMAIL, // Your email to receive messages
    subject: `New Message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Contact: ${contact}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
