const bcrypt = require('bcrypt');
const User = require('../Models/userModel');
const PendingSignup = require('../Models/PendingSignupModel');
const { sendSignupOTPEmail } = require('../lib/mailer');

const SendSignupOTP = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists',
                success: false,
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        await PendingSignup.findOneAndUpdate(
            { email },
            {
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
            },
            { upsert: true, new: true }
        );

        await sendSignupOTPEmail(email, otp, name);

        res.status(200).json({
            message: 'OTP sent to your email. Please verify to complete signup.',
            success: true,
        });
    } catch (error) {
        console.error('SendSignupOTP error:', error);
        res.status(500).json({
            message: 'Failed to send OTP. Please try again.',
            success: false,
        });
    }
};

module.exports = SendSignupOTP;
