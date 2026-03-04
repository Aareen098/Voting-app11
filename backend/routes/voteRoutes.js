const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { submitVote, getResults, getMyVote, resetVotes } = require("../controllers/voteController");
const adminOnly = require("../middleware/adminMiddleware");

router.post("/", protect, submitVote);
router.get("/results", getResults);
router.get("/my-vote", protect, getMyVote);
router.delete("/reset", protect, adminOnly, resetVotes);

module.exports = router;