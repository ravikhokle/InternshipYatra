const mongoose = require("mongoose");
const Post = require("../Models/PostModel");

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId || !mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid post id",
        success: false,
      });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(500).json({
        message: "Failed to delete post",
        success: false,
      });
    }

    res.status(200).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting post",
      error: error.message,
      success: false,
    });
  }
};

module.exports = deletePost;
