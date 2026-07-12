const crypto = require('crypto');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../Models/userModel');

const DEFAULT_PROFILE =
    'https://res.cloudinary.com/db1xxbbat/image/upload/v1736079370/frontend/umzlgcigwtajqrqhrtct.png';

const issueAuthResponse = async (user, res, message) => {
    const accessToken = JWT.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRATE,
        { expiresIn: '15m' }
    );

    const refreshToken = JWT.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message,
        success: true,
        accessToken,
        name: user.name,
        userID: user._id,
        userProfile: user.profileImgURL,
        isNewUser: message.includes('created'),
    });
};

const GoogleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required', success: false });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                message: 'Google sign-in is not configured on the server',
                success: false,
            });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        if (!email || !googleId) {
            return res.status(400).json({ message: 'Invalid Google account data', success: false });
        }

        let user = await User.findOne({ email });
        let message = 'Login successful';

        if (user) {
            if (user.googleId && user.googleId !== googleId) {
                return res.status(409).json({
                    message: 'This email is linked to a different Google account',
                    success: false,
                });
            }

            if (!user.googleId) {
                user.googleId = googleId;
                if (picture && (!user.profileImgURL || user.profileImgURL === DEFAULT_PROFILE)) {
                    user.profileImgURL = picture;
                }
                await user.save();
            }
        } else {
            const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

            user = new User({
                name: name || email.split('@')[0],
                email,
                password: randomPassword,
                profileImgURL: picture || DEFAULT_PROFILE,
                googleId,
                authProvider: 'google',
            });

            await user.save();
            message = 'Account created successfully';
        }

        await issueAuthResponse(user, res, message);
    } catch (error) {
        console.error('GoogleAuth error:', error);
        res.status(500).json({
            message: 'Google sign-in failed. Please try again.',
            success: false,
        });
    }
};

module.exports = GoogleAuth;
