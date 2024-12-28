const mongoose = require("mongoose");

const applySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    resumeURL: { type: String, required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Rejected", "Accepted"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

applySchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("Apply", applySchema);
