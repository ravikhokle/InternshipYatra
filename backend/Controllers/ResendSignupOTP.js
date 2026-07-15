const PendingSignup = require('../Models/PendingSignupModel');
const { sendSignupOTPEmail } = require('../lib/mailer');

const ResendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        pending.otp = otp;
        pending.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await pending.save();

        await sendSignupOTPEmail(email, otp, pending.name);

        res.status(200).json({
            message: 'New OTP sent to your email.',
            success: true,
        });
    } catch (error) {
        console.error('ResendSignupOTP error:', error);
        res.status(500).json({
            message: 'Failed to resend OTP. Please try again.',
            success: false,
        });
    }
};

module.exports = ResendSignupOTP;
