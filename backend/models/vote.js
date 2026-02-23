const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    candidate: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true   // 👈 VERY IMPORTANT (one vote per user)
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);