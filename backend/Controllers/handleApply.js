const mongoose = require('mongoose');
const User = require('../Models/userModel');
const Post = require('../Models/PostModel');
const Apply = require('../Models/applyModel');

const handleApply = async (req, res) => {
    try {
        const { _id, postId } = req.query;

        if (!_id || !postId) {
            return res.status(400).json({ message: 'User ID and Post ID are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid User ID or Post ID.' });
        }

        const findUser = await User.findById(_id);
        const findPost = await Post.findById({ _id: postId});

        if (!findUser) {
            return res.status(404).json({ message: 'Invalid user. You cannot apply.' });
        }

        const { name, resumeURL } = findUser;
        const { title } = findPost;

        if (!resumeURL) {
            return res.status(400).json({ message: 'Please upload your resume on your profile page.' });
        }

        const newApplication = new Apply({
            userId: _id,
            postId,
            title,
            name,
            resumeURL,
            status: 'Applied',
        });

        await newApplication.save();
        return res.status(200).json({ message: 'Applied successfully.' });
    } catch (error) {
        if (error.code === 11000) {
            console.error('Duplicate application detected:', error.keyValue);
            return res.status(409).json({ message: 'You have already applied for this Internship' });
        }
        console.error('Application error:', error);
        return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

module.exports = handleApply;
