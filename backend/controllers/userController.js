const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;

    if (req.file) {
      user.profileImage = req.file.filename;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};