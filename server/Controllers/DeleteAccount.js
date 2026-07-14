const User = require('../Models/userModel');
const Post = require('../Models/PostModel');
const Apply = require('../Models/applyModel');
const PendingSignup = require('../Models/PendingSignupModel');

const DeleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        const userPosts = await Post.find({ userId: userId.toString() });
        const postIds = userPosts.map((post) => post._id);

        await Promise.all([
            Apply.deleteMany({ postId: { $in: postIds } }),
            Apply.deleteMany({ userId }),
            Post.deleteMany({ userId: userId.toString() }),
            PendingSignup.deleteOne({ email: user.email }),
        ]);

        await User.findByIdAndDelete(userId);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            message: 'Account deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('DeleteAccount error:', error);
        res.status(500).json({
            message: 'Failed to delete account. Please try again.',
            success: false,
        });
    }
};

module.exports = DeleteAccount;
