const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { updateProfile } = require("../controllers/userController");

router.put(
  "/profile",
  upload.single("profileImage"),
  updateProfile
);

module.exports = router;   // 🔥 THIS LINE IS REQUIRED