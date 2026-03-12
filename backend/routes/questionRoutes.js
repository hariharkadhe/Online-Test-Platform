const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all questions for a specific exam
router.get('/exam/:examId', authMiddleware, async (req, res) => {
    try {
        // Check if exam exists
        const exam = await Exam.findById(req.params.examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        let questions = await Question.find({ examId: req.params.examId });

        // Hide answers from students for security
        if (req.user.role !== 'admin') {
            questions = questions.map(q => ({
                _id: q._id,
                examId: q.examId,
                question: q.question,
                options: q.options
            }));
        }

        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a question to an exam (Admins only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { examId, question, options, correctAnswer } = req.body;
        const newQuestion = new Question({ examId, question, options, correctAnswer });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
