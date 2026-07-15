const User = require('../Models/userModel');
const { sendOTPEmail } = require('../lib/mailer');

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required', success: false });
        }

        const user = await User.findOne({ email });

        // Always respond the same way to prevent email enumeration attacks
        if (!user) {
            return res.status(200).json({
                message: 'If this email is registered, an OTP has been sent.',
                success: true,
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP + expiry (10 minutes from now)
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            message: 'OTP sent to your email address.',
            success: true,
        });

    } catch (error) {
        console.error('ForgotPassword error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.', success: false });
    }
};

module.exports = ForgotPassword;
