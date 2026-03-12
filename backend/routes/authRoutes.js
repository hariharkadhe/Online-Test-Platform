const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Track login attempts in memory for simple protection
const loginAttempts = {};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'student' // Limit to these two roles
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check login attempts
        if (loginAttempts[email] && loginAttempts[email] >= 5) {
            return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            loginAttempts[email] = (loginAttempts[email] || 0) + 1;
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            loginAttempts[email] = (loginAttempts[email] || 0) + 1;
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Reset attempts on successful login
        loginAttempts[email] = 0;

        const payload = {
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

        res.json({ token, role: user.role, name: user.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
