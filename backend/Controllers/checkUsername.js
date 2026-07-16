const mongoose = require('mongoose');
const User = require('../Models/userModel');
const {
    validateUsername,
    getUsernameChangeStatus,
    isUsernameAvailable,
} = require('../lib/username');

const checkUsername = async (req, res) => {
    try {
        const { username, _id } = req.query;

        if (!username) {
            return res.status(400).json({ message: 'Username is required.', success: false });
        }

        const validation = validateUsername(username);
        if (!validation.valid) {
            return res.status(200).json({
                success: true,
                available: false,
                message: validation.message,
            });
        }

        const excludeId = _id && mongoose.Types.ObjectId.isValid(_id) ? _id : null;
        const available = await isUsernameAvailable(validation.username, excludeId);

        res.status(200).json({
            success: true,
            available,
            username: validation.username,
            message: available ? 'Username is available.' : 'Username is already taken.',
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to check username.', success: false });
    }
};

module.exports = checkUsername;
