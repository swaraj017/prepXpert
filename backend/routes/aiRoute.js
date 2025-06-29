const express = require("express");
const { generateQuestions, generateExplanation } = require("../controller/aicontroller");

const router = express.Router();

router.post("/generate-ques", generateQuestions);
router.post("/generate-explanation", generateExplanation);

module.exports = router;
