const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ResetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: 'Reset token and new password are required', success: false });
        }

        if (newPassword.length < 5) {
            return res.status(400).json({ message: 'Password must be at least 5 characters', success: false });
        }

        // Verify the reset token
        let decoded;
        try {
            decoded = JWT.verify(resetToken, process.env.JWT_SECRATE);
        } catch (err) {
            return res.status(403).json({ message: 'Reset link has expired. Please start over.', success: false });
        }

        // Ensure it was issued for password reset
        if (decoded.purpose !== 'password-reset') {
            return res.status(403).json({ message: 'Invalid reset token.', success: false });
        }

        // Find user and confirm the stored resetToken matches
        const user = await User.findById(decoded._id);

        if (!user || user.resetToken !== resetToken) {
            return res.status(403).json({ message: 'Reset token is invalid or already used.', success: false });
        }

        // Hash the new password and save
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null; // consume token (one-time use)
        user.refreshToken = null; // invalidate all active sessions

        await user.save();

        res.status(200).json({
            message: 'Password reset successfully. You can now log in.',
            success: true,
        });

    } catch (error) {
        console.error('ResetPassword error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.', success: false });
    }
};

module.exports = ResetPassword;
