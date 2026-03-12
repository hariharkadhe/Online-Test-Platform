const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Question = require('../models/Question');
const { authMiddleware } = require('../middleware/authMiddleware');

// Check if user already attempted exam
router.get('/check/:examId', authMiddleware, async (req, res) => {
    try {
        const result = await Result.findOne({ studentId: req.user.id, examId: req.params.examId });
        if (result) {
            return res.json({ attempted: true, score: result.score });
        }
        return res.json({ attempted: false });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user results
router.get('/my-results', authMiddleware, async (req, res) => {
    try {
        const results = await Result.find({ studentId: req.user.id }).populate('examId', 'title duration');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit Exam
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { examId, answers } = req.body; // answers: { "qId1": "Option A" }

        // Check if already submitted
        const existing = await Result.findOne({ studentId: req.user.id, examId });
        if (existing) {
            return res.status(400).json({ message: 'Exam already submitted' });
        }

        const questions = await Question.find({ examId });
        let score = 0;

        questions.forEach(q => {
            const qId = q._id.toString();
            if (answers[qId] && answers[qId] === q.correctAnswer) {
                score += 1;
            }
        });

        const result = new Result({
            studentId: req.user.id,
            examId,
            score
        });

        await result.save();
        res.json({ message: 'Exam submitted successfully', score });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
