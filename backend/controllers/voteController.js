const Vote = require("../models/Vote");

exports.submitVote = async (req, res) => {
  try {
    const { candidate } = req.body;

    if (!candidate) {
      return res.status(400).json({ message: "Candidate is required" });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ user: req.user });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const vote = await Vote.create({
      candidate,
      user: req.user
    });

    res.status(201).json({
      message: "Vote submitted successfully",
      vote
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: "$candidate",
          totalVotes: { $sum: 1 }
        }
      }
    ]);

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};