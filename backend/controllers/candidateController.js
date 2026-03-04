const Candidate = require("../models/Candidate");

exports.getCandidates = async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
};

exports.addCandidate = async (req, res) => {
  try {
    const { name, party } = req.body;

    if (!name || !party) {
      return res.status(400).json({ message: "All fields required" });
    }

    const candidate = await Candidate.create({
      name,
      party,
      image: req.file ? req.file.filename : null,
    });

    // 🔥 Emit real-time update
    console.log("Io instance:", req.app.get("io"));
    const io = req.app.get("io");
    io.emit("candidateUpdated");

    res.status(201).json(candidate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { name, party } = req.body;

    const updateData = { name, party };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    const io = req.app.get("io");
    io.emit("candidateUpdated");

    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    io.emit("candidateUpdated");

    res.json({ message: "Candidate removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};