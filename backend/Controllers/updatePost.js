const mongoose = require("mongoose");
const Post = require("../Models/PostModel");

const updatePost = async (req, res) => {
  try {
    const { postId, title, companyName, skills, stipend, location, duration, startDate, postDetails } = req.body;

    if (!postId || !mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid post id",
        success: false,
      });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (companyName) updateFields.companyName = companyName;
    if (skills) updateFields.skills = skills;
    if (stipend) updateFields.stipend = stipend;
    if (location) updateFields.location = location;
    if (duration) updateFields.duration = duration;
    if (startDate) updateFields.startDate = startDate;
    if (postDetails) updateFields.postDetails = postDetails;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Failed to update your post.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Post updated",
      success: true,
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update your post",
      error: error.message,
      success: false,
    });
  }
};

module.exports = updatePost;
