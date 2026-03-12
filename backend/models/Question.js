const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of strings for choices
    correctAnswer: { type: String, required: true }, // The correct option
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
