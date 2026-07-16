const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { getJwtSecret, getRefreshSecret, cookieOptions } = require("../lib/env");

const Login = async (req, res) => {
    try {
        const jwtSecret = getJwtSecret();
        const refreshSecret = getRefreshSecret();

        if (!jwtSecret || !refreshSecret) {
            return res.status(503).json({
                message: "Server auth is not configured. Missing JWT secrets.",
                success: false,
            });
        }

        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        const ErrorMSG = "Invalid email or password";
        if (!userData) {
            return res.status(403).json({ message: ErrorMSG, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, userData.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: ErrorMSG, success: false });
        }

        // Short-lived access token (15 minutes)
        const accessToken = JWT.sign(
            { email: userData.email, _id: userData._id },
            jwtSecret,
            { expiresIn: '15m' }
        );

        const refreshToken = JWT.sign(
            { _id: userData._id },
            refreshSecret,
            { expiresIn: '7d' }
        );

        userData.refreshToken = refreshToken;
        await userData.save();

        res.cookie('refreshToken', refreshToken, cookieOptions());

        res.status(200).json({
            message: "Login Success",
            success: true,
            accessToken,
            name: userData.name,
            userID: userData._id,
            username: userData.username,
            userProfile: userData.profileImgURL,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = Login;
