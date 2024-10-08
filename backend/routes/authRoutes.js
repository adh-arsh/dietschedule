const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid'); 

const router = express.Router();

// POST /api/register (User Registration)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with a unique identifier
        const uniqueId = uuidv4(); // Generate a unique ID
        user = new User({ email, password: hashedPassword, uniqueId });
        await user.save();

        // Create and return JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and uniqueId
        res.json({ token, uniqueId });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// POST /api/login (User Sign In)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create and return JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and uniqueId
        res.json({ token, uniqueId: user.uniqueId });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


router.get('/test', async (req, res) => {
    res.send('Hello World');
});

module.exports = router;
