const mongoose = require('mongoose');
const Post = require('../Models/PostModel');

const userPosts = async (req, res) => {
    try {

        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const userPosts = await Post.find({     
              userId: { '$regex': _id }
        });

        if (!userPosts) {
            return res.status(404).json({ message: 'Post not found by user' });
        }

        const postsData = userPosts.map(post => ({
            id: post._id,
            title: post.title,
        }));

        res.status(200).json(postsData);

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = userPosts;
