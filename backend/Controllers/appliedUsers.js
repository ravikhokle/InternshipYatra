const mongoose = require('mongoose');
const Apply = require('../Models/applyModel');
const User = require('../Models/userModel');

const appliedUsers = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID.' });
        }

        const appliedUsersData = await Apply.find({ postId });

        if (appliedUsersData.length === 0) {
            return res.status(404).json({ message: 'No users have applied for this post yet.' });
        }

        const userIds = appliedUsersData.map((entry) => entry.userId);
        const users = await User.find({ _id: { $in: userIds } }).select('username');
        const usernameById = Object.fromEntries(users.map((user) => [user._id.toString(), user.username]));

        const response = appliedUsersData.map((entry) => ({
            ...entry.toObject(),
            username: usernameById[entry.userId.toString()] || null,
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

module.exports = appliedUsers;
