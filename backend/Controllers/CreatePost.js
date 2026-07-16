const Post = require('../Models/PostModel');
const User = require('../Models/userModel');
const { ensureUniqueSlug } = require('../lib/slug');

const CreatePost = async (req, res) => {
    try {
        const { title, companyName, skills, stipend, location, duration, startDate, postDetails, userId } = req.body;
        const {companyLogoURL} = await User.findById({_id:userId});
        const slug = await ensureUniqueSlug(title);
        const newPost = Post({ title, companyName, skills, stipend, location, duration, startDate, postDetails, userId, companyLogoURL, slug });
        await newPost.save();
        
        res.status(200).json({
            message: "Your internship is published",
            success: true,
            slug,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
}

module.exports = CreatePost;