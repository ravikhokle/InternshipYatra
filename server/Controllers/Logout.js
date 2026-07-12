const User = require("../Models/userModel");

const Logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            // Invalidate refresh token in DB so it can't be reused
            await User.findOneAndUpdate(
                { refreshToken: token },
                { refreshToken: null }
            );
        }

        // Clear the httpOnly cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: "Logged out successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = Logout;
