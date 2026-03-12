const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all exams
router.get('/', authMiddleware, async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create exam (Admins only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { title, duration } = req.body;
        const newExam = new Exam({ title, duration });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
