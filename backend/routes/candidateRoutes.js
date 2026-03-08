const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getCandidates,
  addCandidate,
  deleteCandidate,
  updateCandidate
} = require("../controllers/candidateController");

router.get("/", getCandidates);

router.post(
  "/",
  protect,
  adminOnly,
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addCandidate
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCandidate
);

router.delete("/:id", protect, adminOnly, deleteCandidate);

module.exports = router;