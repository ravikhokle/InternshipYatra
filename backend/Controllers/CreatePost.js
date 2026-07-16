const Post = require('../Models/PostModel');
const User = require('../Models/userModel');
const { ensureUniqueSlug } = require('../lib/slug');

const normalizeApplyLink = (value) => {
    if (value == null) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    try {
        const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) return '';
        return parsed.toString();
    } catch {
        return '';
    }
};

const CreatePost = async (req, res) => {
    try {
        const { title, companyName, skills, stipend, location, duration, startDate, postDetails, userId, applyLink } = req.body;
        const {companyLogoURL} = await User.findById({_id:userId});
        const slug = await ensureUniqueSlug(title);
        const newPost = Post({
            title,
            companyName,
            skills,
            stipend,
            location,
            duration,
            startDate,
            postDetails,
            userId,
            companyLogoURL,
            slug,
            applyLink: normalizeApplyLink(applyLink),
        });
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