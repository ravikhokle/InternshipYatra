const mongoose = require('mongoose');
const Apply = require('../Models/applyModel');

const appliedUsers = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID.' });
        }

        const appliedUsersData = await Apply.find({ postId })

        if (appliedUsersData.length === 0) {
            return res.status(404).json({ message: 'No users have applied for this post yet.' });
        }

        return res.status(200).json(appliedUsersData);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

module.exports = appliedUsers;
