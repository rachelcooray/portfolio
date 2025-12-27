const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rachelcooraytest@gmail.com', // Your email
        pass: 'vnwx fkpo tjvt wafv'       // Your App Password
    }
});

// --- API ROUTES ---

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email Content
    const mailOptions = {
        from: email, // Sender address
        to: 'rachelcooraytest@gmail.com', // Where you want to receive it
        subject: `Portfolio Contact: ${name}`,
        text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent from ${name}`);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ready to handle contact form submissions.`);
});
