require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Database Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
    try {
        let mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.log('No MONGO_URI provided, starting in-memory DB...');
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectDB();
