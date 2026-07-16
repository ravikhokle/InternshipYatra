const mongoose = require('mongoose');
const Post = require('../Models/PostModel');
const { ensureUniqueSlug } = require('../lib/slug');

const viewDetails = async (req, res) => {
    const { id, slug } = req.query;

    try {
        if (!id && !slug) {
            return res.status(400).json({ message: 'Internship id or slug is required.' });
        }

        let post = null;

        if (slug) {
            post = await Post.findOne({ slug });
        } else if (mongoose.Types.ObjectId.isValid(id)) {
            post = await Post.findById(id);
        } else {
            post = await Post.findOne({ slug: id });
        }

        if (!post) {
            return res.status(404).json({ message: 'Internship not found.' });
        }

        if (!post.slug) {
            post.slug = await ensureUniqueSlug(post.title, post._id);
            await post.save();
        }

        res.status(200).json([post]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = viewDetails;
