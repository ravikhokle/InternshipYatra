const mongoose = require('mongoose');
const Post = require('../Models/PostModel');

const findPost = async (req, res) => {
    const { id } = req.query;

    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = findPost;
