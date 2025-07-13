import { transporter } from '../utils/mailer.js';

/**
 * POST /api/contact
 * Body: { name: string, email: string, message: string }
 * Sends an email to smunch.dev@gmail.com with the form details.
 */
export const sendContactEmail = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const mailOptions = {
      from: 'SMUNCH Contact Form <smunch.dev@gmail.com>',
      to: 'smunch.dev@gmail.com',
      subject: `Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Your message has been sent! We will get back to you soon.' });
  } catch (err) {
    next(err);
  }
}; 