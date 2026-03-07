const Vote = require("../models/vote");

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

    req.io.emit("voteUpdated");

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

exports.getMyVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ user: req.user });

    if (!vote) {
      return res.json({ voted: false });
    }

    res.json({
      voted: true,
      candidate: vote.candidate
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetVotes = async (req, res) => {
  try {
    await Vote.deleteMany({});
    res.json({ message: "All votes have been reset" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};