const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);