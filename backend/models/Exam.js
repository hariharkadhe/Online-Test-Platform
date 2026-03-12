const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // duration in minutes
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
