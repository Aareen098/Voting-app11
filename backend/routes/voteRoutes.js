const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { submitVote, getResults } = require("../controllers/voteController");

router.post("/", protect, submitVote);
router.get("/results", getResults);

module.exports = router;