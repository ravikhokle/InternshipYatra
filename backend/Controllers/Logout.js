const User = require("../Models/userModel");
const { clearCookieOptions } = require("../lib/env");

const Logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await User.findOneAndUpdate(
                { refreshToken: token },
                { refreshToken: null }
            );
        }

        res.clearCookie('refreshToken', clearCookieOptions());

        res.status(200).json({ message: "Logged out successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = Logout;
