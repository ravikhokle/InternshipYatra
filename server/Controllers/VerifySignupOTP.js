const User = require('../Models/userModel');
const PendingSignup = require('../Models/PendingSignupModel');

const DEFAULT_PROFILE =
    'https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png';

const VerifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required',
                success: false,
            });
        }

        const pending = await PendingSignup.findOne({ email });

        if (!pending) {
            return res.status(400).json({
                message: 'No pending signup found. Please register again.',
                success: false,
            });
        }

        if (new Date() > pending.otpExpiry) {
            await PendingSignup.deleteOne({ email });
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.',
                success: false,
            });
        }

        if (pending.otp !== otp.toString()) {
            return res.status(400).json({
                message: 'Incorrect OTP. Please try again.',
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await PendingSignup.deleteOne({ email });
            return res.status(409).json({
                message: 'An account with this email already exists',
                success: false,
            });
        }

        const user = new User({
            name: pending.name,
            email: pending.email,
            password: pending.password,
            profileImgURL: DEFAULT_PROFILE,
            authProvider: 'local',
        });

        await user.save();
        await PendingSignup.deleteOne({ email });

        res.status(201).json({
            message: 'Account created successfully! You can now log in.',
            success: true,
        });
    } catch (error) {
        console.error('VerifySignupOTP error:', error);
        res.status(500).json({
            message: 'Something went wrong. Please try again.',
            success: false,
        });
    }
};

module.exports = VerifySignupOTP;
