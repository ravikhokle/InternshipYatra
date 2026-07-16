const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');
const { getJwtSecret } = require('../lib/env');

const VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required', success: false });
        }

        const user = await User.findOne({ email });

        if (!user || !user.otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
        }

        // Check OTP expiry
        if (new Date() > user.otpExpiry) {
            // Clear expired OTP
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.', success: false });
        }

        // Check OTP value
        if (user.otp !== otp.toString()) {
            return res.status(400).json({ message: 'Incorrect OTP. Please try again.', success: false });
        }

        // OTP is valid — clear it and issue a short-lived reset token (15 min)
        user.otp = null;
        user.otpExpiry = null;

        const resetToken = JWT.sign(
            { _id: user._id, purpose: 'password-reset' },
            getJwtSecret(),
            { expiresIn: '15m' }
        );

        user.resetToken = resetToken;
        await user.save();

        res.status(200).json({
            message: 'OTP verified successfully.',
            success: true,
            resetToken, // client passes this to the reset-password step
        });

    } catch (error) {
        console.error('VerifyOTP error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.', success: false });
    }
};

module.exports = VerifyOTP;
