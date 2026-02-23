const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists)
      return res.status(400).json({ message: "User already exsits" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.status(201).json({
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email
  }
});

  } catch (err) {
  console.log(err); // 👈 VERY IMPORTANT
  res.status(500).json({ message: err.message });
}
};

//Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Incoming email:", email);
    console.log("Incoming password:", password);

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    console.log("User found:", user);
    if (!user)
      return res.status(400).json({ message: "User not found" });

    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Password incorrect" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};