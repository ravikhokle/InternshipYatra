const JWT = require("jsonwebtoken");
const User = require("../Models/userModel");
const { getJwtSecret, getRefreshSecret } = require("../lib/env");

const RefreshToken = async (req, res) => {
    try {
        const jwtSecret = getJwtSecret();
        const refreshSecret = getRefreshSecret();

        if (!jwtSecret || !refreshSecret) {
            return res.status(503).json({ message: "Server auth is not configured", success: false });
        }

        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "Refresh token missing", success: false });
        }

        // Verify the refresh token signature
        let decoded;
        try {
            decoded = JWT.verify(token, refreshSecret);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token", success: false });
        }

        // Check if the token matches what's stored in DB (allows server-side logout)
        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Refresh token revoked", success: false });
        }

        // Issue a new short-lived access token
        const accessToken = JWT.sign(
            { email: user.email, _id: user._id },
            jwtSecret,
            { expiresIn: '15m' }
        );

        res.status(200).json({ success: true, accessToken });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = RefreshToken;
