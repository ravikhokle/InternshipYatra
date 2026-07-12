const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const Login = async (req, res) => {
    try {
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
            process.env.JWT_SECRATE,
            { expiresIn: '15m' }
        );

        // Long-lived refresh token (7 days)
        const refreshToken = JWT.sign(
            { _id: userData._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Save refresh token to DB
        userData.refreshToken = refreshToken;
        await userData.save();

        // Send refresh token as httpOnly cookie (not accessible by JS)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        });

        res.status(200).json({
            message: "Login Success",
            success: true,
            accessToken,
            name: userData.name,
            userID: userData._id,
            userProfile: userData.profileImgURL,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = Login;
