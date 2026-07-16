const { sendContactEmail, sendContactThankYouEmail } = require('../lib/mailer');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactUs = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                message: 'Please fill in name, email, and message.',
                success: false,
            });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                message: 'Please enter a valid email address.',
                success: false,
            });
        }

        await sendContactEmail({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || '',
            message: message.trim(),
        });

        await sendContactThankYouEmail({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || 'your message',
        });

        res.status(200).json({
            message: 'Message sent successfully.',
            success: true,
        });
    } catch (error) {
        console.error('ContactUs error:', error);
        res.status(500).json({
            message: 'Failed to send message. Please try again later.',
            success: false,
        });
    }
};

module.exports = ContactUs;
